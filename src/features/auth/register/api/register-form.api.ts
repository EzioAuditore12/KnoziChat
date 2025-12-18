import type { Except } from 'type-fest';

import { env } from '@/env';

import { typedFetch } from '@/lib/fetch';

import type { RegisterFormParam } from '../schemas/register-form/register-form-params.schema';
import { registerFormResponseSchema } from '../schemas/register-form/register-form-response.schema';

export const registerFormApi = async (data: Except<RegisterFormParam, 'confirmPassword'>) => {
  const filteredData = { ...data };
  if (!filteredData.email) {
    delete filteredData.email;
  }
  if (!filteredData.middleName) {
    delete filteredData.middleName;
  }

  return await typedFetch({
    url: `${env.API_URL}/auth/register`,
    method: 'POST',
    body: filteredData,
    schema: registerFormResponseSchema,
  });
};
