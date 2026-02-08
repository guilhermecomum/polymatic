import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { Database } from "./types";

const isLocalhost =
  process.env.DATABASE_URL.includes("localhost") ||
  process.env.DATABASE_URL.includes("127.0.0.1");

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
