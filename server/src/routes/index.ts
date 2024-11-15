import { Hono } from "hono";
import apiDocsRoute, { initApiDocs } from "./api/index.js";
import healthRoutes from "./api/health.js";
import countriesRoutes from "./api/countries.js";
export function registerRoutes(app: Hono) {
  const api = new Hono();

  initApiDocs(app);

  // Mount all API routes
  api.route("/", apiDocsRoute);
  api.route("/health", healthRoutes);
  api.route("/countries", countriesRoutes);

  app.route("/api", api);

  app.get("/", (c) => c.text("Hello Hono!"));
}
