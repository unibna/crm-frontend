import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";

// react flow
import "reactflow/dist/style.css";

// slick-carousel
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

// highlight
import "./utils/highlight";

// editor
import "react-quill/dist/quill.snow.css";

// lazy image
import "react-lazy-load-image-component/src/effects/black-and-white.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-lazy-load-image-component/src/effects/opacity.css";

// contexts
import { SettingsProvider } from "contexts/SettingsContext";

import { BrowserRouter } from "react-router-dom";
import "simplebar/src/simplebar.css";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { vi } from "date-fns/locale";
import { StrictMode } from "react";
import App from "./App";

const SENTRY_URL = import.meta.env.REACT_APP_SENTRY_URL;
const SENTRY_TRACING_ORIGIN = `https://${window.location.hostname}`;

Sentry.init({
  dsn: SENTRY_URL,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,
  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: [SENTRY_TRACING_ORIGIN, /^\//],
    }),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  enabled: import.meta.env.NODE_ENV !== "development",
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
});

console.log(
  "%cStop!",
  "color:red;font-family:system-ui;font-size:4rem;-webkit-text-stroke: 1px black;font-weight:bold"
);
console.log("%cĐây là tính năng dành cho nhà phát triển", "color:cyan;");

// ----------------------------------------------------------------------

ReactDOM.render(
  <StrictMode>
    <HelmetProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={vi}>
        <SettingsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SettingsProvider>
      </LocalizationProvider>
    </HelmetProvider>
  </StrictMode>,
  document.getElementById("root")
);
