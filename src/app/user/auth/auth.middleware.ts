import { AuthSchema, UserSchema } from '@api/schema';
import { getEnv } from '@infra/env/service';
import { err } from '@src/utils';
import { Request, Response, NextFunction } from 'express';
import { TsRestRequest, TsRestRequestHandler } from '@ts-rest/express';
import { AppRoute } from '@ts-rest/core';
import jwt from 'jsonwebtoken';

const JWT_SECRET = getEnv('JWT_SECRET');
export const tokenKey = 'authToken';

const extractTokenFromCookie = <T extends AppRoute>(req: TsRestRequest<T>): string | undefined => {
  const token = req.signedCookies?.[tokenKey];
  if (!token) throw err.Unauthorized();
  return token;
};

export const auth: TsRestRequestHandler<any> = (request, reply, next) => {
  try {
    const token = extractTokenFromCookie(request);
    if (!token) return next(err.Unauthorized());

    const payload = jwt.verify(token, JWT_SECRET);

    request.user = payload as AuthSchema['Payload'];
    next();
  } catch (e) {
    next(err.Unauthorized('invalid token'));
  }
};

const roleGuard = (roles: UserSchema['Schema']['role'][]): TsRestRequestHandler<any> => (request, reply, next) => {
  auth(request, reply, (error?: any) => {
    if (error) return next(error);

    if (request.user?.role === 'admin') return next();
    if (!request.user || !roles.includes(request.user.role)) {
      return next(err.Forbidden('invalid role'));
    }
    next();
  });
};

export const middleware = {
  auth: [auth] as TsRestRequestHandler<AppRoute>[],
  roleGuard: (roles: UserSchema['Schema']['role'][]) => [roleGuard(roles)] as TsRestRequestHandler<AppRoute>[],
};