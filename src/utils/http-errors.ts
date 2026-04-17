import { RequestValidationError, TsRestRequest } from '@ts-rest/express';
import createHttpError from 'http-errors';
import { Response, NextFunction } from 'express';
import { AppRoute } from '@ts-rest/core';

export const err = createHttpError;

export const requestValidationErrorHandler = <T extends AppRoute>(
  error: RequestValidationError,
  request: TsRestRequest<T>,
  reply: Response,
  next: NextFunction,
) => {
  const message = error.body?.issues?.map((i: any) => `${i.path?.map((p: any) => p)?.join(', ')}: ${i.message}`)?.join('; ');
  next(err.BadRequest(message || 'Validation failed'));
};

export const errorUtil = {
  err,
  requestValidationErrorHandler,
};