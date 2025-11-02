import authenticatedAxiosInstance from '@/features/auth/common/api/auth.api';

import { userSchema } from '../schemas/user.schema';

const url = '/user/profile';

export const getProfileApi = async () => {
  const response = await authenticatedAxiosInstance.get(url);

  const parsed = userSchema.safeParse(response.data);

  if (!parsed.success) {
    throw new Error(
      `Validation failed: ${JSON.stringify(parsed.error.message)}`,
    );
  }

  return parsed.data;
};
