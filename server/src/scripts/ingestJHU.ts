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

async function ingestJHUData() {
	try {
		// Create table if not exists
		const schemaSQL = fs.readFileSync(path.join(process.cwd(), "src/db/schemas/jhu.sql"), "utf-8");
		await pool.query(schemaSQL);

		// Clear existing data
		await pool.query("TRUNCATE TABLE covid_jhu");

		// Read and parse CSV
		const parser = fs.createReadStream("../covid_data/jhu/full_data.csv").pipe(
			parse({
				columns: true,
				skip_empty_lines: true,
			}),
		);

		for await (const record of parser) {
			const query = `
				INSERT INTO covid_jhu (
					date,
					location,
					new_cases,
					new_deaths,
					total_cases,
					total_deaths,
					weekly_cases,
					weekly_deaths,
					biweekly_cases,
					biweekly_deaths
				) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
				ON CONFLICT (date, location) DO UPDATE SET
					new_cases = EXCLUDED.new_cases,
					new_deaths = EXCLUDED.new_deaths,
					total_cases = EXCLUDED.total_cases,
					total_deaths = EXCLUDED.total_deaths,
					weekly_cases = EXCLUDED.weekly_cases,
					weekly_deaths = EXCLUDED.weekly_deaths,
					biweekly_cases = EXCLUDED.biweekly_cases,
					biweekly_deaths = EXCLUDED.biweekly_deaths
			`;

			const values = [
				record.date,
				record.location,
				record.new_cases || null,
				record.new_deaths || null,
				record.total_cases || null,
				record.total_deaths || null,
				record.weekly_cases || null,
				record.weekly_deaths || null,
				record.biweekly_cases || null,
				record.biweekly_deaths || null,
			];

			await pool.query(query, values);
		}

		console.log("JHU data ingestion completed successfully");
	} catch (error) {
		console.error("Error ingesting JHU data:", error);
	} finally {
		await pool.end();
	}
}

ingestJHUData();
