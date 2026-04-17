import { UserSchema as Schema } from '@api/schema';
import { db, DB } from '@infra/db/db';
import { PaginationUtil } from '@src/utils';
import { Insertable, Selectable, sql, Updateable } from 'kysely';

type Table = DB['users'];
const table = 'users';
type Filter = Partial<Selectable<Table> & Schema['GetAll']>;
type Insert = Insertable<Table>;
type Edit = Updateable<Table>;

const getAll = async (p: Filter & PaginationUtil['LimitOffset']) => {
  let q = db.selectFrom(table);

  if (p.id) q = q.where('id', '=', p.id);
  if (p.role) q = q.where('role', '=', p.role);
  if (p.email) q = q.where('email', '=', p.email);
  if (p.status) q = q.where('status', '=', p.status);
  if (p.birthday) q = q.where(sql<boolean>`birthday = ${p.birthday}::date`);
  if (p.fio) q = q.where('fio', 'ilike', `%${p.fio}%`);
  if (p.text) {
    q = q.where(o =>
      o.or([
        o('email', 'ilike', `%${p.text}%`),
        o('fio', 'ilike', `%${p.text}%`),
      ]),
    );
  }

  const c = await q.select(o => o.fn.countAll().as('c')).executeTakeFirst();

  const data = await q
    .select([
      'id',
      'fio',
      'birthday',
      'email',
      'role',
      'status',
      'createdAt',
    ])
    .limit(p.limit)
    .offset(p.offset)
    .$if(!!p.sortBy, o => o.clearOrderBy().orderBy(p.sortBy!, p.sortDirection))
    .execute();

  return {
    count: Number(c?.c),
    data
  };
};

const getOne = (id: string) => {
  return db
    .selectFrom(table)
    .where('id', '=', id)
    .select([
      'id',
      'fio',
      'birthday',
      'email',
      'role',
      'status',
      'createdAt',
    ])
    .executeTakeFirst();
};

const findOne = async (p: Filter) => {
  let q = db.selectFrom(table);

  if (p.id) q = q.where('id', '=', p.id);
  if (p.fio) q = q.where('fio', '=', p.fio);
  if (p.role) q = q.where('role', '=', p.role);
  if (p.email) q = q.where('email', '=', p.email);
  if (p.status) q = q.where('status', '=', p.status);
  if (p.birthday) q = q.where(sql<boolean>`birthday = ${p.birthday}::date`);

  return q
    .select([
      'id',
      'fio',
      'birthday',
      'email',
      'role',
      'status',
      'createdAt',
    ])
    .executeTakeFirst();
};

const create = (p: Insert) => {
  return db.insertInto(table).values(p).returningAll().executeTakeFirst();
};

const edit = (id: string, p: Edit) => {
  return db.updateTable(table).where('id', '=', id).set(p).returningAll().executeTakeFirst();
};

const remove = (id: string) => {
  return db.deleteFrom(table).where('id', '=', id).executeTakeFirst();
};

const getByEmail = (email: string) => {
  return db
    .selectFrom(table)
    .where('email', '=', email)
    .selectAll()
    .executeTakeFirst();
};

export const userRepo = {
  getAll,
  getOne,
  findOne,
  create,
  edit,
  getByEmail,
  remove,
};
