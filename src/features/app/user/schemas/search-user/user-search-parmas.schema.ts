import { z } from 'zod';

export const userSearchParamsSchema = z.object({
  search: z.string().max(50),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).default(30),
});

export type UserSearchParams = z.infer<typeof userSearchParamsSchema>;
