import { type } from 'arktype';

import { tokensSchema } from '@/features/common/schemas/tokens.schema';
import { userSchema } from '@/features/common/schemas/user.schema';

export const verifyRegisterationResponseSchema = type({
  status: 'string',
  message: 'string',
  user: userSchema,
  tokens: tokensSchema,
});

export type VerifyRegisterationResponse = typeof verifyRegisterationResponseSchema.infer;
