import { DB as Database } from './types';
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { getEnv } from '@infra/env/service';
import { UserSchema } from '@src/api/schema';

const dialect = new PostgresDialect({
  pool: new Pool({
    database: getEnv('DB_NAME'),
    user: getEnv('DB_USERNAME'),
    password: getEnv('DB_PASSWORD'),
    port: getEnv('DB_PORT'),
    host: 'localhost',
    max: 10,
  }),
});

export type DB = Database & {
  users: Database['users'] & { role: UserSchema['Schema']['role'] };
};

export const db = new Kysely<DB>({ dialect });