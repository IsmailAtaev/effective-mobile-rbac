import { UserSchema as Schema } from '@api/schema';
import { bcryptService, err, paginationUtil } from '@src/utils';
import { userRepo as repo } from './repo';

const getAll = async (p: Schema['GetAll']) => {
  const { limit, offset } = paginationUtil.limitOffset(p);
  return repo.getAll({ ...p, limit, offset });
};

const getOne = async (id: string) => {
  const one = await repo.getOne(id);
  if (!one) throw new err.NotFound();

  return one;
};

const create = async (p: Schema['Create']) => {
  const phoneExist = await repo.findOne({ email: p.email });
  if (phoneExist) throw err.BadRequest('email have exist');

  const password = await bcryptService.hashPass(p.password);

  const one = await repo.create({ ...p, password });
  if (!one) throw err.BadRequest('not created');

  return one;
};

const edit = async (id: string, p: Schema['Edit']) => {
  const one = await repo.getOne(id);
  if (!one) throw new err.NotFound();
  await repo.edit(id, p);
  return one;
};

const remove = async (id: string) => {
  const one = await repo.getOne(id);
  if (!one) throw new err.NotFound();
  await repo.remove(id);
  return one;
};

const profile = async (id: string) => {
  return getOne(id);
};

const changePassword = async (id: string, p: { password: string }) => {
  const one = await repo.getOne(id);
  if (!one) throw new err.NotFound();

  const password = await bcryptService.hashPass(p.password);
  await repo.edit(id, { password });

  return one;
};

export const userService = {
  getAll,
  getOne,
  create,
  edit,
  remove,
  profile,
  changePassword,
};