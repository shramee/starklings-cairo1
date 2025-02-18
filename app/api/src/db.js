import {
  PG_DATABASE,
  PG_HOST,
  PG_PASSWORD,
  PG_PORT,
  PG_USER,
  PG_DATABASE_SSL,
} from "./config.js";
import pg from "pg";

export const pool = new pg.Pool({
  port: PG_PORT,
  host: PG_HOST,
  user: PG_USER,
  password: PG_PASSWORD,
  database: PG_DATABASE,
  ssl: PG_DATABASE_SSL
});

pool.on("connect", () => {
  console.log("Database connected");
});
