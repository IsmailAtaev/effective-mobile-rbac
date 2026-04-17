import type { Kysely } from 'kysely';

// replace `any` with your database interface.
export async function seed(db: Kysely<any>): Promise<void> {
  await db
    .insertInto('users')
    .values([
      {
        fio: 'admin',
        email: 'admin@mail.ru',
        role: 'admin',
        password: '$2b$10$Qt.zr5bQ3XYMgEqEzmhZeucBfGLN2s6l/.LVdVYRfhBP2wQWvelAq',
      },
    ])
    .execute();
}