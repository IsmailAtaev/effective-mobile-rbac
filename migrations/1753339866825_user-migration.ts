import { sql, type Kysely } from 'kysely';

const table = 'users';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(table)
    .ifNotExists()
    .addColumn('id', 'uuid', c => c.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('fio', 'varchar')
    .addColumn('birthday', 'varchar')
    .addColumn('email', 'varchar', c => c.notNull().unique())
    .addColumn('password', 'varchar', c => c.notNull().unique())
    .addColumn('role', 'varchar', c => c.notNull())
    .addColumn('status', 'boolean', c => c.notNull().defaultTo(true))
    .addColumn('createdAt', 'timestamptz', c => c.notNull().defaultTo(sql`now()`))
    .addUniqueConstraint('phone_deletedAt_unique', ['email', 'password'])
    .execute();

  await db.schema.createIndex('users_email_index').on(table).column('email').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(table).ifExists().execute();
}