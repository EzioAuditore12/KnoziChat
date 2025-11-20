import axios from 'axios';
import { env } from '@/env';

import { userSchema } from '../schemas/user.schema';

const url = '/user/profile';

export const getProfileApi = async (id: string) => {
  const response = await axios.get(url);

  const parsed = userSchema.safeParse(response.data);

  if (!parsed.success) {
    throw new Error(
      `Validation failed: ${JSON.stringify(parsed.error.message)}`,
    );
  }

  return parsed.data;
};

export const getUserApi = async (id: string) => {
  const url = `${env.EXPO_PUBLIC_API_URL}/user/${id}`;
  const response = await axios.get(url);

  const parsed = userSchema.safeParse(response.data);

  if (!parsed.success) {
    throw new Error(
      `Validation failed: ${JSON.stringify(parsed.error.message)}`,
    );
  }

  return parsed.data;
};
