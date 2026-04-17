import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { userSchema as schema } from '../schema';
import { paramsId } from '../schema/common';

const c = initContract();

export const userContract = c.router(
  {
    getAll: {
      method: 'GET',
      path: '',
      query: schema.getAll,
      responses: {
        200: schema.getAllRes,
      },
    },
    getOne: {
      method: 'GET',
      path: '/:id',
      pathParams: paramsId,
      responses: {
        200: schema.getOneRes,
        404: z.null(),
      },
    },
    create: {
      method: 'POST',
      path: '',
      body: schema.create,
      responses: {
        201: schema.getOneRes,
      },
    },
    edit: {
      method: 'PUT',
      path: '/:id',
      body: schema.edit,
      pathParams: paramsId,
      responses: {
        201: schema.getOneRes,
      },
    },
    remove: {
      method: 'DELETE',
      path: '/:id',
      pathParams: paramsId,
      responses: {
        201: schema.getOneRes,
      },
    },


    getProfile: {
      method: 'GET',
      path: '/profile',
      responses: {
        200: schema.getOneRes,
      },
    },

    // changePassword: {
    //   method: 'POST',
    //   path: '/change-password',
    //   body: schema.changePassword,
    //   responses: {
    //     201: schema.getOneRes,
    //   },
    // },

  },
  { pathPrefix: '/api/users' },
);