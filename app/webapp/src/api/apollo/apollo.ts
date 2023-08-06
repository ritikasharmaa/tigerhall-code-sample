import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
  split
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { logger } from '@tigerhall/core';
import sha from 'sha.js';
import {
  createPersistedQueryLink,
  PersistedQueryLink
} from '@apollo/client/link/persisted-queries';
import { store } from 'redux/store';
import { getAccessToken } from 'redux/ducks/user';
import handleAPIErrors from 'api/errors';

import {
  defaultPaginationPolicy,
  notificationFetchMorePolicy
} from './typePolicies';

export const cache = new InMemoryCache({
  typePolicies: {
    User: {
      fields: {
        finishedContent: defaultPaginationPolicy,
        notifications: notificationFetchMorePolicy,
        followings: defaultPaginationPolicy,
        suggestedUsersToFollow: defaultPaginationPolicy
      }
    },
    Query: {
      fields: {
        streams: defaultPaginationPolicy,
        events: defaultPaginationPolicy,
        podcasts: defaultPaginationPolicy,
        contentCards: defaultPaginationPolicy,
        learningPaths: defaultPaginationPolicy
      }
    }
  },
  possibleTypes: {
    ContentCard: ['Ebook', 'Event', 'Expert', 'Podcast', 'Stream']
  }
});

const webSocketLink = new WebSocketLink({
  uri: `${import.meta.env.VITE_WS_URL}/graphql`,
  options: {
    lazy: true,
    reconnect: true,
    connectionParams: () => {
      const token = getAccessToken(store.getState());
      if (token) {
        return {
          authorization: token
        };
      }

      return {};
    }
  }
});

// This uses a domain behind cloudflare argo that is the fastest way to connect
// to our API servers
const apiLink = new HttpLink({
  uri: `${import.meta.env.VITE_API_URL}/v2/`,
  fetch: (...args) => fetch(...args)
});

// Network link checks the definition of the GraphQL definition and sends
// it either via the WebSocket link for subscriptions or default http
const networkLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  webSocketLink,
  apiLink
);

export function disconnectWebsocket(): void {
  // @ts-ignore
  const client = webSocketLink.subscriptionClient;
  client.close(false, true);
}

/**
 * Inject the authentication token into the requests made by apollo
 */
const authMiddleware = new ApolloLink((operation, forward) => {
  const token = getAccessToken(store.getState());

  if (token) {
    operation.setContext({
      headers: {
        authorization: `jwt ${token}`
      }
    });
  }

  return forward(operation);
});

/**
 * Checks the incoming error from the request and if it's a 401 error we log
 * the user out from the platform using keycloak
 */
function errorHandler(): ApolloLink {
  return onError((err) => {
    const { networkError, operation, graphQLErrors, response } = err;

    if (graphQLErrors?.[0].extensions?.code === 'PERSISTED_QUERY_NOT_FOUND') {
      return;
    }

    logger.debug({ networkError, response, operation, graphQLErrors });

    handleAPIErrors({ networkError });
  });
}

const encrypt: PersistedQueryLink.Options['sha256'] = (query) =>
  sha('sha256').update(query).digest('hex');

const link = createPersistedQueryLink({ sha256: encrypt }).concat(
  errorHandler().concat(from([authMiddleware, networkLink]))
);

/**
 * Export the constructed apollo client
 */
export const apolloClient = new ApolloClient({
  cache,
  link
});

export async function clearCache() {
  await apolloClient.resetStore();
}
