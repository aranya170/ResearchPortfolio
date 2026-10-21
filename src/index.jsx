import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// Fonts are self-hosted (bundled) instead of loaded from Google Fonts: one fewer
// render-blocking request and no third-party round trip before text can paint
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";
import "./index.css";
import App from "./App";

const container = document.getElementById("root");
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// The homepage HTML is pre-rendered at build time; reuse it there. Other routes (/admin)
// receive the same file, so discard the homepage markup and render from scratch.
if (container.hasChildNodes() && window.location.pathname === "/") {
  hydrateRoot(container, app);
} else {
  container.innerHTML = "";
  createRoot(container).render(app);
}
