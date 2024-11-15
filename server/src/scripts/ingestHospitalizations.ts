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

async function ingestHospitalizationsData() {
	try {
		const schemaSQL = fs.readFileSync(path.join(process.cwd(), "src/db/schemas/hospitalizations.sql"), "utf-8");
		await pool.query(schemaSQL);

		await pool.query("TRUNCATE TABLE covid_hospitalizations");

		const parser = fs.createReadStream("../covid_data/hospitalizations/covid-hospitalizations.csv").pipe(
			parse({
				columns: true,
				skip_empty_lines: true,
			}),
		);

		for await (const record of parser) {
			if (!record.entity || !record.date || !record.indicator) {
				console.warn("Skipping record due to missing required fields:", record);
				continue;
			}

			const query = `
                INSERT INTO covid_hospitalizations (
                    entity,
                    iso_code,
                    date,
                    indicator,
                    value
                ) VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (entity, date, indicator) DO UPDATE SET
                    iso_code = EXCLUDED.iso_code,
                    value = EXCLUDED.value
            `;

			const values = [record.entity.trim(), record.iso_code, record.date, record.indicator, record.value || null];

			await pool.query(query, values);
		}

		console.log("Hospitalizations data ingestion completed successfully");
	} catch (error) {
		console.error("Error ingesting hospitalizations data:", error);
	} finally {
		await pool.end();
	}
}

ingestHospitalizationsData();
