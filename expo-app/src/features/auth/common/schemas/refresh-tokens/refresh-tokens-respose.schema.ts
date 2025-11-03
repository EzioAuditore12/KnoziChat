import { z } from 'zod';

import { tokensSchema } from '../token.schema';

export const refreshTokensResponseSchema = tokensSchema;

export type RefershTokensResponse = z.infer<typeof refreshTokensResponseSchema>;
