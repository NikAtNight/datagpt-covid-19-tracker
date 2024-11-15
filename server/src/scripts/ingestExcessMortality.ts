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
					p_scores_15_64,
					p_scores_65_74,
					p_scores_75_84,
					p_scores_85plus,
					deaths_2020_all_ages,
					average_deaths_2015_2019_all_ages,
					deaths_2015_all_ages,
					deaths_2016_all_ages,
					deaths_2017_all_ages,
					deaths_2018_all_ages,
					deaths_2019_all_ages,
					deaths_2010_all_ages,
					deaths_2011_all_ages,
					deaths_2012_all_ages,
					deaths_2013_all_ages,
					deaths_2014_all_ages,
					deaths_2021_all_ages,
					time,
					time_unit,
					p_scores_0_14,
					projected_deaths_since_2020_all_ages,
					excess_proj_all_ages,
					cum_excess_proj_all_ages,
					cum_proj_deaths_all_ages,
					cum_p_proj_all_ages,
					p_proj_all_ages,
					p_proj_0_14,
					p_proj_15_64,
					p_proj_65_74,
					p_proj_75_84,
					p_proj_85p,
					cum_excess_per_million_proj_all_ages,
					excess_per_million_proj_all_ages,
					deaths_2022_all_ages,
					deaths_2023_all_ages,
					deaths_since_2020_all_ages
				) VALUES (${Array.from({ length: 39 }, (_, i) => `$${i + 1}`).join(", ")})
				ON CONFLICT (location, date) DO UPDATE SET
					p_scores_all_ages = EXCLUDED.p_scores_all_ages,
					p_scores_15_64 = EXCLUDED.p_scores_15_64,
					p_scores_65_74 = EXCLUDED.p_scores_65_74,
					p_scores_75_84 = EXCLUDED.p_scores_75_84,
					p_scores_85plus = EXCLUDED.p_scores_85plus,
					deaths_2020_all_ages = EXCLUDED.deaths_2020_all_ages,
					average_deaths_2015_2019_all_ages = EXCLUDED.average_deaths_2015_2019_all_ages,
					deaths_2015_all_ages = EXCLUDED.deaths_2015_all_ages,
					deaths_2016_all_ages = EXCLUDED.deaths_2016_all_ages,
					deaths_2017_all_ages = EXCLUDED.deaths_2017_all_ages,
					deaths_2018_all_ages = EXCLUDED.deaths_2018_all_ages,
					deaths_2019_all_ages = EXCLUDED.deaths_2019_all_ages,
					deaths_2010_all_ages = EXCLUDED.deaths_2010_all_ages,
					deaths_2011_all_ages = EXCLUDED.deaths_2011_all_ages,
					deaths_2012_all_ages = EXCLUDED.deaths_2012_all_ages,
					deaths_2013_all_ages = EXCLUDED.deaths_2013_all_ages,
					deaths_2014_all_ages = EXCLUDED.deaths_2014_all_ages,
					deaths_2021_all_ages = EXCLUDED.deaths_2021_all_ages,
					time = EXCLUDED.time,
					time_unit = EXCLUDED.time_unit,
					p_scores_0_14 = EXCLUDED.p_scores_0_14,
					projected_deaths_since_2020_all_ages = EXCLUDED.projected_deaths_since_2020_all_ages,
					excess_proj_all_ages = EXCLUDED.excess_proj_all_ages,
					cum_excess_proj_all_ages = EXCLUDED.cum_excess_proj_all_ages,
					cum_proj_deaths_all_ages = EXCLUDED.cum_proj_deaths_all_ages,
					cum_p_proj_all_ages = EXCLUDED.cum_p_proj_all_ages,
					p_proj_all_ages = EXCLUDED.p_proj_all_ages,
					p_proj_0_14 = EXCLUDED.p_proj_0_14,
					p_proj_15_64 = EXCLUDED.p_proj_15_64,
					p_proj_65_74 = EXCLUDED.p_proj_65_74,
					p_proj_75_84 = EXCLUDED.p_proj_75_84,
					p_proj_85p = EXCLUDED.p_proj_85p,
					cum_excess_per_million_proj_all_ages = EXCLUDED.cum_excess_per_million_proj_all_ages,
					excess_per_million_proj_all_ages = EXCLUDED.excess_per_million_proj_all_ages,
					deaths_2022_all_ages = EXCLUDED.deaths_2022_all_ages,
					deaths_2023_all_ages = EXCLUDED.deaths_2023_all_ages,
					deaths_since_2020_all_ages = EXCLUDED.deaths_since_2020_all_ages
			`;

			const values = [
				record.location,
				record.date,
				record.p_scores_all_ages || null,
				record.p_scores_15_64 || null,
				record.p_scores_65_74 || null,
				record.p_scores_75_84 || null,
				record.p_scores_85plus || null,
				record.deaths_2020_all_ages || null,
				record.average_deaths_2015_2019_all_ages || null,
				record.deaths_2015_all_ages || null,
				record.deaths_2016_all_ages || null,
				record.deaths_2017_all_ages || null,
				record.deaths_2018_all_ages || null,
				record.deaths_2019_all_ages || null,
				record.deaths_2010_all_ages || null,
				record.deaths_2011_all_ages || null,
				record.deaths_2012_all_ages || null,
				record.deaths_2013_all_ages || null,
				record.deaths_2014_all_ages || null,
				record.deaths_2021_all_ages || null,
				record.time || null,
				record.time_unit || null,
				record.p_scores_0_14 || null,
				record.projected_deaths_since_2020_all_ages || null,
				record.excess_proj_all_ages || null,
				record.cum_excess_proj_all_ages || null,
				record.cum_proj_deaths_all_ages || null,
				record.cum_p_proj_all_ages || null,
				record.p_proj_all_ages || null,
				record.p_proj_0_14 || null,
				record.p_proj_15_64 || null,
				record.p_proj_65_74 || null,
				record.p_proj_75_84 || null,
				record.p_proj_85p || null,
				record.cum_excess_per_million_proj_all_ages || null,
				record.excess_per_million_proj_all_ages || null,
				record.deaths_2022_all_ages || null,
				record.deaths_2023_all_ages || null,
				record.deaths_since_2020_all_ages || null,
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
