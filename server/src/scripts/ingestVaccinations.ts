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

async function ingestVaccinationsData() {
	try {
		// Create table if not exists
		const schemaSQL = fs.readFileSync(path.join(process.cwd(), "src/db/schemas/vaccinations.sql"), "utf-8");
		await pool.query(schemaSQL);

		// Clear existing data
		await pool.query("TRUNCATE TABLE covid_vaccinations");

		// Read and parse CSV
		const parser = fs.createReadStream("../covid_data/vaccinations/vaccinations.csv").pipe(
			parse({
				columns: true,
				skip_empty_lines: true,
			}),
		);

		for await (const record of parser) {
			const query = `
					INSERT INTO covid_vaccinations (
						location,
						iso_code,
						date,
						total_vaccinations,
						people_vaccinated,
						people_fully_vaccinated,
						total_boosters,
						daily_vaccinations_raw,
						daily_vaccinations,
						total_vaccinations_per_hundred,
						people_vaccinated_per_hundred,
						people_fully_vaccinated_per_hundred,
						total_boosters_per_hundred,
						daily_vaccinations_per_million,
						daily_people_vaccinated,
						daily_people_vaccinated_per_hundred
					) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
					ON CONFLICT (location, date) DO UPDATE SET
						iso_code = EXCLUDED.iso_code,
						total_vaccinations = EXCLUDED.total_vaccinations,
						people_vaccinated = EXCLUDED.people_vaccinated,
						people_fully_vaccinated = EXCLUDED.people_fully_vaccinated,
						total_boosters = EXCLUDED.total_boosters,
						daily_vaccinations_raw = EXCLUDED.daily_vaccinations_raw,
						daily_vaccinations = EXCLUDED.daily_vaccinations,
						total_vaccinations_per_hundred = EXCLUDED.total_vaccinations_per_hundred,
						people_vaccinated_per_hundred = EXCLUDED.people_vaccinated_per_hundred,
						people_fully_vaccinated_per_hundred = EXCLUDED.people_fully_vaccinated_per_hundred,
						total_boosters_per_hundred = EXCLUDED.total_boosters_per_hundred,
						daily_vaccinations_per_million = EXCLUDED.daily_vaccinations_per_million,
						daily_people_vaccinated = EXCLUDED.daily_people_vaccinated,
						daily_people_vaccinated_per_hundred = EXCLUDED.daily_people_vaccinated_per_hundred
				`;

			const values = [
				record.location,
				record.iso_code,
				record.date,
				record.total_vaccinations || null,
				record.people_vaccinated || null,
				record.people_fully_vaccinated || null,
				record.total_boosters || null,
				record.daily_vaccinations_raw || null,
				record.daily_vaccinations || null,
				record.total_vaccinations_per_hundred || null,
				record.people_vaccinated_per_hundred || null,
				record.people_fully_vaccinated_per_hundred || null,
				record.total_boosters_per_hundred || null,
				record.daily_vaccinations_per_million || null,
				record.daily_people_vaccinated || null,
				record.daily_people_vaccinated_per_hundred || null,
			];

			await pool.query(query, values);
		}

		console.log("Vaccinations data ingestion completed successfully");
	} catch (error) {
		console.error("Error ingesting vaccinations data:", error);
	} finally {
		await pool.end();
	}
}

ingestVaccinationsData();
