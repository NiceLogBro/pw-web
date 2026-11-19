import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Self-hosted variable fonts: no render-blocking third-party request to
// fonts.googleapis.com, and the files are cached with the rest of the bundle.
import "@fontsource-variable/inter";
import "@fontsource-variable/sora";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
