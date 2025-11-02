import axios from 'axios';
import { env } from '@/env';

import type { RefershTokensParam } from '../schemas/refresh-tokens/refresh-tokens-param.schema';
import { refreshTokensResponseSchema } from '../schemas/refresh-tokens/refresh-tokens-respose.schema';

const url = `${env.EXPO_PUBLIC_API_URL}/auth/refresh`;

export const refreshTokensApi = async (data: RefershTokensParam) => {
  const response = await axios.post(url, data);

  const parsed = refreshTokensResponseSchema.safeParse(response.data);

  if (!parsed.success)
    throw new Error(
      `Validation failed: ${JSON.stringify(parsed.error.message)}`,
    );

  return parsed.data;
};
