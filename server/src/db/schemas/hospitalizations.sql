CREATE TABLE IF NOT EXISTS covid_hospitalizations (
	entity VARCHAR(100),
	iso_code VARCHAR(10),
	date DATE,
	indicator VARCHAR(100),
	value NUMERIC,
	PRIMARY KEY (entity, date, indicator)
);
