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

async function ingestVaccinationsByManufacturerData() {
	try {
		// Create table if not exists
		const schemaSQL = fs.readFileSync(path.join(process.cwd(), "src/db/schemas/vaccinations.sql"), "utf-8");
		await pool.query(schemaSQL);

		// Clear existing data
		await pool.query("TRUNCATE TABLE covid_vaccinations_by_manufacturer");

		// Read and parse CSV
		const parser = fs.createReadStream("../covid_data/vaccinations/vaccinations-by-manufacturer.csv").pipe(
			parse({
				columns: true,
				skip_empty_lines: true,
			}),
		);

		for await (const record of parser) {
			const query = `
				INSERT INTO covid_vaccinations_by_manufacturer (
					location,
					date,
					vaccine,
					total_vaccinations
				) VALUES ($1, $2, $3, $4)
				ON CONFLICT (location, date, vaccine) DO UPDATE SET
					total_vaccinations = EXCLUDED.total_vaccinations
			`;

			const values = [record.location, record.date, record.vaccine, record.total_vaccinations || null];

			await pool.query(query, values);
		}

		console.log("Vaccinations by manufacturer data ingestion completed successfully");
	} catch (error) {
		console.error("Error ingesting vaccinations by manufacturer data:", error);
	} finally {
		await pool.end();
	}
}

ingestVaccinationsByManufacturerData();
