import { type } from 'arktype';

import { userSchema } from '../user.schema';

const meta = type({
  itemsPerPage: 'number',
  totalItems: 'number',
  currentPage: 'number',
  totalPages: 'number',
  sortBy: 'unknown',
});

export const userSearchResponseSchema = type({
  data: userSchema.array(),
  meta,
  links: 'unknown',
});

export type UserSearchResponse = typeof userSearchResponseSchema.infer;
