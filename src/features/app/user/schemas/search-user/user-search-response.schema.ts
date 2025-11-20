import { z } from 'zod';

import { userSchema } from '../user.schema';

export const userSearchResponseSchema = z.object({
  data: z.array(userSchema),
  meta: z.object({
    itemsPerPage: z.number(),
    totalItems: z.number(),
    currentPage: z.number(),
    totalPages: z.number(),
    sortBy: z.any(), // Accept any type for sortBy
  }),
  links: z.any(), // Accept any type for links
});

export type UserSearchResponse = z.infer<typeof userSearchResponseSchema>;
