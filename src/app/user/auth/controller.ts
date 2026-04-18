import { authContract } from '@api/contracts/auth';
import { s } from '@app/router';
import { middleware, tokenKey } from '@app/user/auth/auth.middleware';
import { authService } from './service';
import { cookieParams } from '@src/utils';

export const authRouter = s.router(authContract, {
  login: {
    handler: async ({ body, res }) => {
      const r = await authService.login(body);
      const { token, ...data } = r;
      res.cookie(tokenKey, token, cookieParams);
      return { status: 201, body: data };
    },
  },
  me: {
    middleware: middleware.auth,
    handler: async ({ req }) => {
      const user = req.user;

      const r = await authService.me(user!.id);
      return { status: 200, body: r };
    },
  },
  logout: {
    middleware: middleware.auth,
    handler: async ({ res }) => {
      res.clearCookie(tokenKey);
      return { status: 200, body: null };
    },
  },

  forgotPassword: {
    handler: async ({ body }) => {
      const r = await authService.forgotPassword(body);
      return { status: 201, body: r };
    },
  },
  register: {
    handler: async ({ body, res }) => {
      const r = await authService.register(body);
      const { token, ...data } = r;

      res.cookie(tokenKey, token, cookieParams);

      return { status: 201, body: data };
    },
  },
  forgotPasswordVerify: {
    handler: async ({ body }) => {
      const r = await authService.forgotPasswordVerify(body);
      return { status: 201, body: r };
    },
  },
});
