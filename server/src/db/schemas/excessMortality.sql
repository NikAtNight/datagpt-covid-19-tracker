CREATE TABLE IF NOT EXISTS covid_excess_mortality (
  	location VARCHAR(100),
	date DATE,
	p_scores_all_ages NUMERIC,
	excess_mortality NUMERIC,
	excess_mortality_cumulative NUMERIC,
	excess_mortality_total NUMERIC,
	excess_mortality_total_per_million NUMERIC,
	PRIMARY KEY (location, date)
);
