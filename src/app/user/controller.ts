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
  getOne: {
    middleware: middleware.ownerOrAdmin,
    handler: async ({ params }) => {
      const r = await service.getOne(params.id);
      return { status: 200, body: r };
    },
  },
  edit: {
    middleware: middleware.ownerOrAdmin,
    handler: async ({ params, body, req }) => {
      let updateData = body;

      if (req.user?.role === 'user') {
        updateData = {};
        if (body.status !== undefined) {
          updateData.status = body.status;
        }
      }

      const r = await service.edit(params.id, updateData);
      return { status: 201, body: r };
    },
  },
  remove: {
    middleware: middleware.ownerOrAdmin,
    handler: async ({ params }) => {
      const r = await service.remove(params.id);
      return { status: 201, body: r };
    },
  },
  changePassword: {
    middleware: middleware.roleGuard(['admin']),
    handler: async ({ params, body }) => {
      const r = await service.changePassword(params.id, body);
      return { status: 201, body: r };
    },
  },
});