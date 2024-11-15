```
bun install

docker compose build

docker compose up
```

## Create DB

```
docker compose exec db bash
su postgres
psql
create user dbmaster with password 'dbmaster';
alter role dbmaster with superuser;
create database covid_db;
grant all privileges on database covid_db to dbmaster;
\q
```

### Run Scripts to Ingest Data

```bash
bun run ingestLatest
bun run ingestCasesDeaths
bun run ingestExcessMortality
bun run ingestHospitalizations
bun run ingestJHU
bun run ingestVaccinations
bun run ingestVaccinationsByManufacturer
bun run ingestVaccinationsByAge
```

open http://localhost:8000
