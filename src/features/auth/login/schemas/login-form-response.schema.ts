import { z } from 'zod';

import { userSchema } from '@/features/app/user/schemas/user.schema';
import { tokensSchema } from '../../common/schemas/token.schema';

export const loginFormResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  user: userSchema,
  tokens: tokensSchema,
});

export type LoginFormResponse = z.infer<typeof loginFormResponseSchema>;
