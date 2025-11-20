import { z } from 'zod';

import { userSchema } from '../user.schema';

export const userSearchResponseSchema = z.object({
  data: z.array(userSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export type UserSearchResponse = z.infer<typeof userSearchResponseSchema>;
