import { parse } from "csv-parse";
import fs from "fs";
import path from "path";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
	user: "dbmaster",
	password: "dbmaster",
	host: "localhost",
	database: "covid_db",
	port: 5432,
});

async function ingestLatestData() {
	try {
		// Create table if not exists
		const schemaSQL = fs.readFileSync(path.join(process.cwd(), "src/db/schemas/latest.sql"), "utf-8");
		await pool.query(schemaSQL);

		// Clear existing data
		await pool.query("TRUNCATE TABLE covid_latest");

		// Read and parse CSV
		const parser = fs.createReadStream("../covid_data/owid-covid-latest.csv").pipe(
			parse({
				columns: true,
				skip_empty_lines: true,
			}),
		);

		for await (const record of parser) {
			const query = `
        INSERT INTO covid_latest (
          iso_code, location, date, total_cases, new_cases,
          total_deaths, new_deaths, total_vaccinations,
          people_vaccinated, people_fully_vaccinated,
          total_boosters, population
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (iso_code) DO UPDATE SET
          location = EXCLUDED.location,
          date = EXCLUDED.date,
          total_cases = EXCLUDED.total_cases,
          new_cases = EXCLUDED.new_cases,
          total_deaths = EXCLUDED.total_deaths,
          new_deaths = EXCLUDED.new_deaths,
          total_vaccinations = EXCLUDED.total_vaccinations,
          people_vaccinated = EXCLUDED.people_vaccinated,
          people_fully_vaccinated = EXCLUDED.people_fully_vaccinated,
          total_boosters = EXCLUDED.total_boosters,
          population = EXCLUDED.population
      `;

			const values = [
				record.iso_code,
				record.location,
				record.date ? record.date : null,
				record.total_cases || null,
				record.new_cases || null,
				record.total_deaths || null,
				record.new_deaths || null,
				record.total_vaccinations || null,
				record.people_vaccinated || null,
				record.people_fully_vaccinated || null,
				record.total_boosters || null,
				record.population || null,
			];

			await pool.query(query, values);
		}

		console.log("Data ingestion completed successfully");
	} catch (error) {
		console.error("Error ingesting data:", error);
	} finally {
		await pool.end();
	}
}

ingestLatestData();
