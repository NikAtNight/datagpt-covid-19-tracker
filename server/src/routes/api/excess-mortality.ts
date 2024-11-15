import { Hono } from "hono";
import { pool } from "../../db/config.js";

const excessMortalityRoutes = new Hono();

excessMortalityRoutes.get("/", async (c) => {
	try {
		const baseline_country = c.req.query("baseline_country");
		const comparison_country = c.req.query("comparison_country");
		const metric = c.req.query("metric");
		const date_from = c.req.query("date_from");
		const date_to = c.req.query("date_to");

		if (!baseline_country || !metric || !date_from || !date_to) {
			return c.json(
				{
					status: "error",
					message: "Missing required parameters",
				},
				400,
			);
		}

		let query = `
			SELECT 
				date,
				${metric} as value,
				location
			FROM covid_excess_mortality
			WHERE location = $1
				AND date BETWEEN $2 AND $3
		`;

		const params = [baseline_country, date_from, date_to];

		if (comparison_country) {
			query += ` OR location = $4`;
			params.push(comparison_country);
		}

		query += ` ORDER BY date ASC`;

		const result = await pool.query(query, params);

		const transformedData = result.rows.reduce((acc: any[], row) => {
			const existingDate = acc.find((item) => item.date === row.date);
			const formattedDate = new Date(row.date).toISOString().split("T")[0];

			if (existingDate) {
				if (row.location === baseline_country) {
					existingDate.baseline = parseFloat(row.value) || 0;
				} else {
					existingDate.comparison = parseFloat(row.value) || 0;
				}
			} else {
				const newDataPoint: any = {
					date: formattedDate,
					baseline: row.location === baseline_country ? parseFloat(row.value) || 0 : 0,
				};

				if (comparison_country) {
					newDataPoint.comparison = row.location === comparison_country ? parseFloat(row.value) || 0 : 0;
				}

				acc.push(newDataPoint);
			}
			return acc;
		}, []);

		return c.json(transformedData);
	} catch (error) {
		console.error("Database error:", error);
		return c.json(
			{
				status: "error",
				message: "Failed to fetch excess mortality data",
			},
			500,
		);
	}
});

export default excessMortalityRoutes;