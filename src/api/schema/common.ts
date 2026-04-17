import { z } from 'zod';

export const commonQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().max(200).default(20),
});

export type CommonQuery = z.infer<typeof commonQuery>;

export const result = z.object({ success: z.boolean() });

export const sortDirection = z.enum(['asc', 'desc']);

export const strBool = z.union([z.enum(['true', 'false']), z.boolean()]).transform(v => v === 'true' || v === true);

export const paramsId = z.object({ id: z.string().uuid() });

export const addFile = z.custom<{ file: any }>();

export const notFound = z.any();

export const dateStrSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD

export const commonSchema = {
  query: commonQuery,
  result,
  sortDirection,
  strBool,
  paramsId,
  addFile,
  notFound,
  dateStrSchema
};

export type CommonSchema = {
  Query: CommonQuery;
};