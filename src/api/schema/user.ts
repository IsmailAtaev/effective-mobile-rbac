import { z } from 'zod';
import { commonQuery, sortDirection, strBool } from './common';

export const schema = z.object({
  id: z.string().uuid(),
  fio: z.string().nullish(),
  birthday: z.string().nullish(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['admin', 'user']),
  status: strBool.optional().default(true),
  createdAt: z.coerce.date(),
});

const userSort = schema
  .pick({
    birthday: true,
    role: true,
    email: true,
    createdAt: true,
  })
  .keyof();

const sort = z
  .object({
    sortBy: userSort.default('createdAt'),
    sortDirection: sortDirection.default('desc'),
  })
  .partial();

export const getAll = schema.extend({ text: z.string() }).partial().merge(sort).merge(commonQuery);
export const getAllRes = z.object({
  count: z.number(),
  data: schema.omit({ password: true }).array(),
});

export const getOneRes = schema.omit({ password: true });

export const create = schema.pick({
  fio: true,
  birthday: true,
  email: true,
  password: true,
  role: true,
});

export const edit = schema
  .pick({
    fio: true,
    birthday: true,
    email: true,
    status: true,
  })
  .partial()

export const editRes = schema.omit({ password: true });

const changePassword = schema.pick({ password: true });
type ChangePassword = z.infer<typeof changePassword>;

export type Schema = z.infer<typeof schema>;
export type GetAll = z.infer<typeof getAll>;
export type Create = z.infer<typeof create>;
export type Edit = z.infer<typeof edit>;

export const userSchema = {
  schema,
  getAll,
  getAllRes,
  getOneRes,
  create,
  edit,
  changePassword,
};

export type UserSchema = {
  Schema: Schema;
  GetAll: GetAll;
  Create: Create;
  Edit: Edit;
  ChangePassword: ChangePassword;
};