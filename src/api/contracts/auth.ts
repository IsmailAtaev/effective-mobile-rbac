import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { authSchema as schema } from '../schema';
import { result } from '../schema/common';

const c = initContract();

export const authContract = c.router(
  {
    login: {
      method: 'POST',
      path: '/login',
      body: schema.login,
      responses: {
        201: schema.loginRes,
      },
    },
    me: {
      method: 'GET',
      path: '/me',
      responses: {
        200: schema.meRes,
      },
    },
    logout: {
      method: 'GET',
      path: '/logout',
      responses: {
        200: z.any(),
      },
    },

    forgotPassword: {
      method: 'POST',
      path: '/forgot-password',
      body: schema.forgotPassword,
      responses: {
        201: result,
      },
    },
    forgotPasswordVerify: {
      method: 'POST',
      path: '/forgot-password-verify',
      body: schema.forgotPasswordVerify,
      responses: {
        201: result,
      },
    },
  },
  { pathPrefix: '/api/auth' },
);