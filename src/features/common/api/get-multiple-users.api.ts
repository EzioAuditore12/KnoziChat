import { typedFetch } from '@/lib/fetch';
import type { MultipleUsersParam } from '../schemas/multiple-user/param.schema';
import { env } from '@/env';
import { userSchema } from '../schemas/user.schema';

export const getMultipleUsersApi = async (data: MultipleUsersParam) => {
  return await typedFetch({
    url: `${env.API_URL}/user/multiple`,
    method: 'POST',
    body: data,
    schema: userSchema.array(),
  });
};
