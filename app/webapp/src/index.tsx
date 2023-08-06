import * as React from 'react';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import { createRoot } from 'react-dom/client';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType
} from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { isProduction } from '@tigerhall/core';
import { App } from 'components/tools';
import * as braze from '@braze/web-sdk';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/mousewheel';
import 'swiper/css/keyboard';
import 'swiper/css/autoplay';

import './global.scss';
import './components/ui/lexical/style/style.css';

if (isProduction && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    // defined in `gitlab-ci.yml`
    release: import.meta.env.VITE_SENTRY_RELEASE,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          React.useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes
        )
      })
    ]
  });
}

// initialize the SDK
braze.initialize(import.meta.env.VITE_BRAZE_API_KEY as string, {
  baseUrl: import.meta.env.VITE_BRAZE_SDK_ENDPOINT as string,
  enableLogging: !import.meta.env.PROD
});

braze.automaticallyShowInAppMessages();
braze.openSession();

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
