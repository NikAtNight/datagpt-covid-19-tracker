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

async function ingestVaccinationsByAgeData() {
	try {
		// Create table if not exists
		const schemaSQL = fs.readFileSync(path.join(process.cwd(), "src/db/schemas/vaccinations.sql"), "utf-8");
		await pool.query(schemaSQL);

		// Clear existing data
		await pool.query("TRUNCATE TABLE covid_vaccinations_by_age");

		// Read and parse CSV
		const parser = fs.createReadStream("../covid_data/vaccinations/vaccinations-by-age-group.csv").pipe(
			parse({
				columns: true,
				skip_empty_lines: true,
			}),
		);

		for await (const record of parser) {
			const query = `
				INSERT INTO covid_vaccinations_by_age (
					location,
					date,
					age_group,
					people_vaccinated_per_hundred,
					people_fully_vaccinated_per_hundred,
					people_with_booster_per_hundred
				) VALUES ($1, $2, $3, $4, $5, $6)
				ON CONFLICT (location, date, age_group) DO UPDATE SET
					people_vaccinated_per_hundred = EXCLUDED.people_vaccinated_per_hundred,
					people_fully_vaccinated_per_hundred = EXCLUDED.people_fully_vaccinated_per_hundred,
					people_with_booster_per_hundred = EXCLUDED.people_with_booster_per_hundred
			`;

			const values = [
				record.location,
				record.date,
				record.age_group,
				record.people_vaccinated_per_hundred || null,
				record.people_fully_vaccinated_per_hundred || null,
				record.people_with_booster_per_hundred || null,
			];

			await pool.query(query, values);
		}

		console.log("Vaccinations by age data ingestion completed successfully");
	} catch (error) {
		console.error("Error ingesting vaccinations by age data:", error);
	} finally {
		await pool.end();
	}
}

ingestVaccinationsByAgeData();
