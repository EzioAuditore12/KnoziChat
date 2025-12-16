import { env } from '@/env';

import { typedFetch } from '@/lib/fetch';

import type { RefreshTokensParam } from '../schemas/refresh-tokens-param.schema';
import { refreshTokensResponseSchema } from '../schemas/refresh-tokens-response.schema';

export const refreshTokensApi = async (data: RefreshTokensParam) => {
  return typedFetch({
    url: `${env.API_URL}/auth/refresh`,
    method: 'POST',
    body: data,
    schema: refreshTokensResponseSchema,
  });
};
