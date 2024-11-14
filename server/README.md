```
bun install

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

```

open http://localhost:8000
