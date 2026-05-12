import { type } from 'arktype';

import { jwtTokenSchema } from '@/lib/schemas';

export const refreshTokensParamSchema = type({
  refreshToken: jwtTokenSchema,
});

export type RefreshTokensParam = typeof refreshTokensParamSchema.infer;
