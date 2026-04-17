import { AuthSchema } from '@api/schema';
import { userRepo } from '@app/user/repo';
import { bcryptService, err, jwtService } from '@src/utils';

const login = async (p: AuthSchema['Login']) => {
  let user = await userRepo.getByEmail(p.email);
  if (!user) throw new err.Unauthorized();

  const passOk = await bcryptService.comparePass(p.password, user.password);
  if (!passOk) throw new err.Unauthorized();

  const token = await jwtService.sign(user);

  const { password, ...userData } = user;

  return { token, ...userData };
};

const me = async (userId: string) => {
  const user = await userRepo.getOne(userId);
  if (!user) throw new err.Unauthorized();
  return user;
};

const forgotPassword = async (p: AuthSchema['ForgotPassword']) => {
  const user = await userRepo.getByEmail(p.email);
  if (!user) throw err.NotFound();

  // TODO: Implement email verification logic
  return { success: true };
};

const forgotPasswordVerify = async (p: AuthSchema['ForgotPasswordVerify']) => {
  const user = await userRepo.getByEmail(p.email);
  if (!user) throw err.BadRequest('user');

  // TODO: Implement email verification check

  const password = await bcryptService.hashPass(p.password);
  await userRepo.edit(user.id, { password });

  return { success: true };
};

export const authService = {
  login,
  me,
  forgotPassword,
  forgotPasswordVerify,
};