import { AuthSchema } from '@api/schema';
import { userRepo } from '@app/user/repo';
import { bcryptService, err, jwtService, mailUtil, otpUtil } from '@src/utils';
import { userService } from '../service';
import { verificationCodesRepo as codesRepo } from './verification-codes.repo';

const login = async (p: AuthSchema['Login']) => {
  let user = await userRepo.getByEmail(p.email);
  if (!user) throw new err.Unauthorized();

  const passOk = await bcryptService.comparePass(p.password, user.password);
  if (!passOk) throw new err.Unauthorized();

  const token = await jwtService.sign(user);

  const { password, ...userData } = user;

  return { token, ...userData };
};

const register = async (p: AuthSchema['Register']) => {
  const user = await userService.create({ ...p, role: 'user' });
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

  const code = otpUtil.genRandomNumber().toString();
  
  await codesRepo.removeByEmail(p.email);
  await codesRepo.create({
    email: p.email,
    code,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  });

  await mailUtil.sendCode(p.email, code);
  
  return { success: true };
};

const forgotPasswordVerify = async (p: AuthSchema['ForgotPasswordVerify']) => {
  const user = await userRepo.getByEmail(p.email);
  if (!user) throw err.BadRequest('user');

  const validCode = await codesRepo.getValid(p.email, p.code);
  if (!validCode) {
    throw err.BadRequest('invalid or expired code');
  }

  const password = await bcryptService.hashPass(p.password);
  await userRepo.edit(user.id, { password });

  await codesRepo.removeByEmail(p.email);

  return { success: true };
};

export const authService = {
  login,
  register,
  me,
  forgotPassword,
  forgotPasswordVerify,
};