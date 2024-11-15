CREATE TABLE IF NOT EXISTS covid_vaccinations (
  location VARCHAR(100),
  date DATE,
  total_vaccinations NUMERIC,
  total_vaccinations_per_hundred NUMERIC,
  daily_vaccinations_raw NUMERIC,
  daily_vaccinations NUMERIC,
  total_vaccinations_per_hundred_people NUMERIC,
  people_vaccinated NUMERIC,
  people_fully_vaccinated NUMERIC,
  total_boosters NUMERIC,
  daily_people_vaccinated NUMERIC,
  daily_people_vaccinated_per_hundred NUMERIC,
  PRIMARY KEY (location, date)
);

CREATE TABLE IF NOT EXISTS covid_vaccinations_by_manufacturer (
  location VARCHAR(100),
  date DATE,
  vaccine VARCHAR(100),
  total_vaccinations NUMERIC,
  PRIMARY KEY (location, date, vaccine)
);

CREATE TABLE IF NOT EXISTS covid_vaccinations_by_age (
  location VARCHAR(100),
  date DATE,
  age_group VARCHAR(50),
  people_vaccinated_per_hundred NUMERIC,
  people_fully_vaccinated_per_hundred NUMERIC,
  people_with_booster_per_hundred NUMERIC,
  PRIMARY KEY (location, date, age_group)
); 
