import { Hono } from "hono";
import apiDocsRoute, { initApiDocs } from "./api/index.js";
import healthRoutes from "./api/health.js";
import countriesRoutes from "./api/countries.js";
import casesDeathsRoutes from "./api/cases-deaths.js";
import excessMortalityRoutes from "./api/excess-mortality.js";
import vaccinationsRoutes from "./api/vaccinations.js";
import vaccinationsByAgeRoutes from "./api/vaccinations-age-group.js";
import vaccinationsByManufacturerRoutes from "./api/vaccinations-manufacturer.js";

export function registerRoutes(app: Hono) {
	const api = new Hono();

	initApiDocs(app);

	// Mount all API routes
	api.route("/", apiDocsRoute);
	api.route("/health", healthRoutes);
	api.route("/countries", countriesRoutes);
	api.route("/cases-deaths", casesDeathsRoutes);
	api.route("/excess-mortality", excessMortalityRoutes);
	api.route("/vaccinations", vaccinationsRoutes);
	api.route("/vaccinations-age-group", vaccinationsByAgeRoutes);
	api.route("/vaccinations-manufacturer", vaccinationsByManufacturerRoutes);

	app.route("/api", api);

	app.get("/", (c) => c.text("Hello Hono!"));
}
