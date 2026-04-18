import { db } from '@infra/db';

const create = async (p: { email: string; code: string; expiresAt: Date }) => {
  return db
    .insertInto('verification_codes')
    .values(p)
    .returningAll()
    .executeTakeFirst();
};

const getValid = async (email: string, code: string) => {
  return db
    .selectFrom('verification_codes')
    .where('email', '=', email)
    .where('code', '=', code)
    .where('expiresAt', '>', new Date())
    .selectAll()
    .executeTakeFirst();
};

const removeByEmail = async (email: string) => {
  return db
    .deleteFrom('verification_codes')
    .where('email', '=', email)
    .execute();
};

export const verificationCodesRepo = {
  create,
  getValid,
  removeByEmail,
};