import axios from 'axios';
import { env } from '@/env';

import { userSearchResponseSchema } from '../schemas/search-user/user-search-response.schema';
import type { UserSearchParams } from '../schemas/search-user/user-search-parmas.schema';

const url = `${env.EXPO_PUBLIC_API_URL}/user`;

export const getUsersApi = async (data: UserSearchParams) => {
  const response = await axios.get(url, {
    params: data,
  });

  const parsed = userSearchResponseSchema.safeParse(response.data);

  if (!parsed.success) {
    console.log(parsed.error.message);
    throw new Error(
      `Validation failed: ${JSON.stringify(parsed.error.message)}`,
    );
  }

  return parsed.data;
};
