import { Hono } from "hono";
import { pool } from "../../db/config.js";

const countriesRoutes = new Hono();

// Get all countries
countriesRoutes.get("/", async (c) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT 
        iso_code, 
        location,
        total_cases,
        total_deaths,
        total_vaccinations,
        population
      FROM covid_latest
      ORDER BY location ASC
    `);

    return c.json({
      status: "success",
      items: result.rows,
    });
  } catch (error) {
    console.error("Database error:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to fetch countries data",
      },
      500
    );
  }
});

countriesRoutes.get("/list", async (c) => {
  try {
    const result = await pool.query(
      `
      SELECT location
      FROM covid_latest
    `
    );

    return c.json({
      status: "success",
      items: result.rows,
    });
  } catch (error) {
    console.error("Database error:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to fetch countries data",
      },
      500
    );
  }
});

export default countriesRoutes;
