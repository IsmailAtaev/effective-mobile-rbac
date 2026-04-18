import { sql, type Kysely } from 'kysely';

const table = 'verification_codes';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(table)
    .ifNotExists()
    .addColumn('id', 'uuid', c => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('email', 'varchar', c => c.notNull())
    .addColumn('code', 'varchar', c => c.notNull())
    .addColumn('expiresAt', 'timestamptz', c => c.notNull())
    .addColumn('createdAt', 'timestamptz', c => c.notNull().defaultTo(sql`now()`))
    .execute();

  await db.schema.createIndex('verification_codes_email_index').on(table).column('email').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(table).ifExists().execute();
}
