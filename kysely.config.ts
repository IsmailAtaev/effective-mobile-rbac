import { defineConfig } from 'kysely-ctl';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import 'dotenv/config';

export default defineConfig({
  kysely: new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new Pool({
        database: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        host: 'localhost',
      }),
    }),
  }),
  migrations: {
    migrationFolder: "migrations",
  },
  seeds: {
    seedFolder: "seeds",
  }
});