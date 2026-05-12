import { type } from 'arktype';

import { tokensSchema } from '@/features/common/schemas/tokens.schema';
import { userSchema } from '@/features/common/schemas/user.schema';

export const loginResponseSchema = type({
  status: " 'success' ",
  message: 'string',
  user: userSchema,
  tokens: tokensSchema,
});

export type LoginResponse = typeof loginResponseSchema.infer;
