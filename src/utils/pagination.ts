import { CommonSchema } from '@src/api/schema/common';

const limitOffset = (d: CommonSchema['Query']) => ({
  offset: (d.page - 1) * d.perPage,
  limit: d.perPage,
});

type LimitOffset = { limit: number; offset: number };

export const paginationUtil = {
  limitOffset,
};

export type PaginationUtil = {
  LimitOffset: LimitOffset;
};