import { Hono } from "hono";
import apiDocsRoute, { initApiDocs } from "./api/index.js";
import covidRoutes from "./api/latest.js";
import healthRoutes from "./api/health.js";
import countriesRoutes from "./api/countries.js";
export function registerRoutes(app: Hono) {
  const api = new Hono();

  initApiDocs(app);

  // Mount all API routes
  api.route("/", apiDocsRoute);
  api.route("/covid", covidRoutes);
  api.route("/health", healthRoutes);
  api.route("/countries", countriesRoutes);

  app.route("/api", api);

  app.get("/", (c) => c.text("Hello Hono!"));
}
