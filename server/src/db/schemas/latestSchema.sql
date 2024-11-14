CREATE TABLE IF NOT EXISTS covid_latest (
  iso_code VARCHAR(10),
  location VARCHAR(100),
  date DATE NULL,
  total_cases NUMERIC,
  new_cases NUMERIC,
  total_deaths NUMERIC,
  new_deaths NUMERIC,
  total_vaccinations NUMERIC,
  people_vaccinated NUMERIC,
  people_fully_vaccinated NUMERIC,
  total_boosters NUMERIC,
  population NUMERIC,
  PRIMARY KEY (iso_code)
);
