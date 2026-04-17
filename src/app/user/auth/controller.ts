import { authContract } from '@api/contracts/auth';
import { s } from '@app/router';
import { middleware, tokenKey } from '@app/user/auth/auth.middleware';
import { authService } from './service';

export const authRouter = s.router(authContract, {
  login: {
    handler: async ({ body, res }) => {
      const r = await authService.login(body);
      const { token, ...data } = r;
      res.cookie(tokenKey, token, {
        httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
        secure: process.env.COOKIE_SECURE === 'true',
        sameSite: (process.env.COOKIE_SAME_SITE as 'strict' | 'lax' | 'none') || 'strict',
        signed: true,
        path: '/',
      });
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
  forgotPasswordVerify: {
    handler: async ({ body }) => {
      const r = await authService.forgotPasswordVerify(body);
      return { status: 201, body: r };
    },
  },
});
