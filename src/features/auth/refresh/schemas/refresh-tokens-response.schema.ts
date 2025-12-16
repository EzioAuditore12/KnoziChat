import { tokensSchema } from '@/features/common/schemas/tokens.schema';

export const refreshTokensResponseSchema = tokensSchema;

export type RefreshTokensResponse = typeof refreshTokensResponseSchema.infer;
