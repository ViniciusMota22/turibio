import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App, { services } from "./App";
import { buildRoutes, seoFor, jsonLd } from "./seo";

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
}
export const routes = () => buildRoutes(services);
export const seo = (url) => seoFor(url, services);
export { jsonLd };
