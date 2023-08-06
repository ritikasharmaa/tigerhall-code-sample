import {
  AnyAction,
  configureStore,
  createListenerMiddleware
} from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import decodeJwt from 'jwt-decode';
import * as braze from '@braze/web-sdk';
import * as sentry from '@sentry/react';
import { apolloClient } from 'api/apollo';

import user, { logout, setAccessToken } from './ducks/user';
import organisations from './ducks/organisations';
import tour from './ducks/tour';
import categories from './ducks/categories';
import learningPaths from './ducks/learningPaths';
import content from './ducks/content';
import experts from './ducks/experts';
import { reducer as events } from '../modules/admin/modules/events';
import videos from './ducks/videos';
import userProfile from './ducks/userProfile';
import podcast, { podcastListeners } from './ducks/podcast';
import sidebar from './ducks/sidebar';
import navigation from './ducks/navigation';
import platform from './ducks/platform';
import assignments from './ducks/assignments';
import popup from './ducks/popup';
import noContentModal from './ducks/noContentModal';

export const reducers = combineReducers({
  // Application reducers
  user,
  platform,
  organisations,
  tour,
  categories,
  experts,
  events,
  videos,
  podcast,
  assignments,

  // Misc
  sidebar,
  navigation,
  popup,
  noContentModal,

  // admin
  learningPaths,
  content,
  userProfile
});

const rootReducer = (state: ReturnType<typeof reducers>, action: AnyAction) => {
  if (action.type === 'LOGOUT') {
    return reducers(undefined, { type: undefined });
  }

  return reducers(state, action);
};

const persistConfig = {
  key: 'root',
  version: 2,
  storage,
  whitelist: ['user', 'sidebar', 'assignments', 'popup']
};

// @ts-ignore
const persistedReducer = persistReducer(persistConfig, rootReducer);

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: setAccessToken,
  effect: (action) => {
    if (!action.payload.token) {
      return window.analytics.reset();
    }

    const claims: { sub: string; organisationId: string } = decodeJwt(
      action.payload.token
    );

    window.analytics.identify(claims.sub);
    window.analytics.group(claims.organisationId);

    // interestingly enough the docs says we shouldn't track the logout calls
    braze.changeUser(claims.sub);

    sentry.setUser({
      id: claims.sub,
      segment: claims.organisationId
    });
  }
});

listenerMiddleware.startListening({
  actionCreator: logout,
  effect: async () => {
    sentry.setUser(null);
    localStorage.clear();

    window.analytics.reset();

    // It's important that this call is last because it's async can could
    // otherwise cause problems with race conditions
    await apolloClient.clearStore();
  }
});

/**
 * calling this function to start the listeners.
 */
podcastListeners(listenerMiddleware);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(listenerMiddleware.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export { listenerMiddleware };
