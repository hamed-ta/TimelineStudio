import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/vazirmatn";
import { initializeBrowserLanguage } from "./i18n";
import { App } from "./app/App";
import "../styles.css";

await initializeBrowserLanguage();

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
