import axios from 'axios';

import { env } from '@/env';

import type { LoginFormParams } from '../schemas/login-form-param.schema';
import { loginFormResponseSchema } from '../schemas/login-form-response.schema';

const url = `${env.EXPO_PUBLIC_API_URL}/auth/login`;

export const loginFormApi = async (data: LoginFormParams) => {
  const response = await axios.post(url, data);

  const parsed = loginFormResponseSchema.safeParse(response.data);

  if (!parsed.success) {;
    throw new Error(
      `Validation failed: ${JSON.stringify(parsed.error.message)}`,
    );
  }

  return parsed.data;
};
