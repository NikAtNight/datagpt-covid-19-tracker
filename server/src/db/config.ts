import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DOCKER_DB_HOST,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || "5432"),
});
