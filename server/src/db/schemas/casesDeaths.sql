CREATE TABLE IF NOT EXISTS covid_cases_deaths (
	date DATE,
	location VARCHAR(100),
	new_cases NUMERIC,
	new_deaths NUMERIC,
	total_cases NUMERIC,
	total_deaths NUMERIC,
	weekly_cases NUMERIC,
	weekly_deaths NUMERIC,
	biweekly_cases NUMERIC,
	biweekly_deaths NUMERIC,
	PRIMARY KEY (date, location)
);
