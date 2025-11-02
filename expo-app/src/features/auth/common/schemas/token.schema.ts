import { z } from 'zod';
import { isJWT } from 'validator';

export const tokensSchema = z.object({
  accessToken: z.string().refine((val) => isJWT(val), {
    error: 'Access Token should be a valid jwt token',
  }),
  refreshToken: z.string().refine((val) => isJWT(val), {
    error: 'Refresh Token should be a valid jwt token',
  }),
});

export type Tokens = z.infer<typeof tokensSchema>;
