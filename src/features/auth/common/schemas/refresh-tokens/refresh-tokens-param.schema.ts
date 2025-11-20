import { z } from 'zod';
import { isJWT } from 'validator';

export const refreshTokensParamSchema = z.object({
  refreshToken: z.string().refine((val) => isJWT(val)),
});

export type RefershTokensParam = z.infer<typeof refreshTokensParamSchema>;
