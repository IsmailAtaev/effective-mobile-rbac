import { userContract } from '@api/contracts/user';
import { s } from '@app/router';
import { middleware } from '@app/user/auth/auth.middleware';
import { userService as service } from './service';

export const userRouter = s.router(userContract, {
  getAll: {
    middleware: middleware.roleGuard(['admin']),
    handler: async ({ query }) => {
      const r = await service.getAll(query);
      return { status: 200, body: r };
    },
  },
  create: {
    middleware: middleware.roleGuard(['admin']),
    handler: async ({ body }) => {
      const r = await service.create(body);
      return { status: 201, body: r };
    },
  },
  edit: {
    middleware: middleware.roleGuard(['admin']),
    handler: async ({ params, body }) => {
      const r = await service.edit(params.id, body);
      return { status: 201, body: r };
    },
  },
  getOne: {
    middleware: middleware.roleGuard(['admin']),
    handler: async ({ params }) => {
      const r = await service.getOne(params.id);
      return { status: 200, body: r };
    },
  },
  remove: {
    middleware: middleware.roleGuard(['admin']),
    handler: async ({ params }) => {
      const r = await service.remove(params.id);
      return { status: 201, body: r };
    },
  },

  getProfile: {
    middleware: middleware.auth,
    handler: async ({ req }) => {
      const r = await service.profile(req.user!.id);
      return { status: 200, body: r };
    },
  },

  // changePassword: {
  //   middleware: middleware.auth,
  //   handler: async ({ req, body }) => {
  //     const r = await service.changePassword(req.user!.id, body);
  //     return { status: 201, body: r };
  //   },
  // },
});
