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

// Get specific country by ISO code
countriesRoutes.get("/:code", async (c) => {
  const code = c.req.param("code");

  try {
    const result = await pool.query(
      `
      SELECT *
      FROM covid_latest
      WHERE iso_code = $1
    `,
      [code.toUpperCase()]
    );

    if (result.rows.length === 0) {
      return c.json(
        {
          status: "error",
          message: "Country not found",
        },
        404
      );
    }

    return c.json({
      status: "success",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Database error:", error);
    return c.json(
      {
        status: "error",
        message: "Failed to fetch country data",
      },
      500
    );
  }
});

export default countriesRoutes;
