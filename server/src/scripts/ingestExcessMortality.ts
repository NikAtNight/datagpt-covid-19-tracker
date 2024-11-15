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

async function ingestExcessMortalityData() {
	try {
		// Create table if not exists
		const schemaSQL = fs.readFileSync(path.join(process.cwd(), "src/db/schemas/excessMortality.sql"), "utf-8");
		await pool.query(schemaSQL);

		// Clear existing data
		await pool.query("TRUNCATE TABLE covid_excess_mortality");

		// Read and parse CSV
		const parser = fs.createReadStream("../covid_data/excess_mortality/excess_mortality.csv").pipe(
			parse({
				columns: true,
				skip_empty_lines: true,
			}),
		);

		for await (const record of parser) {
			const query = `
				INSERT INTO covid_excess_mortality (
					location,
					date,
					p_scores_all_ages,
					excess_mortality,
					excess_mortality_cumulative,
					excess_mortality_total,
					excess_mortality_total_per_million
				) VALUES ($1, $2, $3, $4, $5, $6, $7)
				ON CONFLICT (location, date) DO UPDATE SET
					p_scores_all_ages = EXCLUDED.p_scores_all_ages,
					excess_mortality = EXCLUDED.excess_mortality,
					excess_mortality_cumulative = EXCLUDED.excess_mortality_cumulative,
					excess_mortality_total = EXCLUDED.excess_mortality_total,
					excess_mortality_total_per_million = EXCLUDED.excess_mortality_total_per_million
			`;

			const values = [
				record.location,
				record.date,
				record.p_scores_all_ages || null,
				record.excess_mortality || null,
				record.excess_mortality_cumulative || null,
				record.excess_mortality_total || null,
				record.excess_mortality_total_per_million || null,
			];

			await pool.query(query, values);
		}

		console.log("Excess mortality data ingestion completed successfully");
	} catch (error) {
		console.error("Error ingesting excess mortality data:", error);
	} finally {
		await pool.end();
	}
}

ingestExcessMortalityData();
