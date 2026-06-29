import type { Except } from 'type-fest';

import { env } from '@/env';
import { typedFetch } from '../../../../../lib/fetch';
import type { RegisterFormParam } from '../schemas/register-form/params.schema';
import { registerFormResponseSchema } from '../schemas/register-form/response.schema';

export const registerFormApi = async (data: Except<RegisterFormParam, 'confirmPassword'>) => {
  const formData = new FormData();

  if (data.avatar) {
    formData.append('avatar', {
      uri: data.avatar.uri,
      name: data.avatar.name,
      type: data.avatar.type,
    } as any);
  }

  formData.append('firstName', data.firstName);
  formData.append('lastName', data.lastName);
  formData.append('email', data.email);
  formData.append('password', data.password);

  if (data.middleName) formData.append('middleName', data.middleName);
  if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);

  return await typedFetch({
    url: `${env.API_URL}/auth/register`,
    method: 'POST',
    body: formData,
    schema: registerFormResponseSchema,
  });
};
