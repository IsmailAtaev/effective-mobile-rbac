import { z } from 'zod';
import { userSchema } from './user';

export const payload = userSchema.schema.pick({ id: true, role: true });
export type Payload = z.infer<typeof payload>;

export const meRes = userSchema.schema.pick({
  id: true,
  email: true,
  fio: true,
  role: true,
});

export const login = userSchema.schema.pick({ email: true, password: true });
export type Login = z.infer<typeof login>;
export const loginRes = meRes;

const forgotPassword = userSchema.schema.pick({ email: true });
type ForgotPassword = z.infer<typeof forgotPassword>;

const forgotPasswordVerify = userSchema.schema
  .pick({
    email: true,
    password: true
  })
  .extend({
    code: z.number().transform(v => String(v))
  });

type ForgotPasswordVerify = z.infer<typeof forgotPasswordVerify>;

export const authSchema = {
  payload,
  meRes,
  login,
  loginRes,
  forgotPassword,
  forgotPasswordVerify,
};

export type AuthSchema = {
  Login: Login;
  Payload: Payload;
  ForgotPassword: ForgotPassword;
  ForgotPasswordVerify: ForgotPasswordVerify;
};