import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from 'api/apollo';
import { theme } from '@tigerhall/theme';
import { ChakraProvider } from '@chakra-ui/react';
import { LinkProvider } from '@tigerhall/components';
import * as React from 'react';
import { LinkWrapper } from 'components/ui';
import { store } from 'redux/store';
import { PublicClientApplication } from '@azure/msal-browser';

interface ProvidersProps {
  children: React.ReactElement;
  msalInstance?: PublicClientApplication;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <ChakraProvider theme={theme}>
          <LinkProvider
            value={{
              link: LinkWrapper
            }}
          >
            {children}
          </LinkProvider>
        </ChakraProvider>
      </ApolloProvider>
    </Provider>
  );
}
