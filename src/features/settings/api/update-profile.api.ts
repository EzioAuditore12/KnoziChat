import { authenticatedTypedFetch } from '@/lib/auth-fetch';

import { userProfileResponseSchema } from '../schemas/user-profile-response.schema';
import type { UpdateProfileParam } from '../schemas/update-profile-param.schema';

export const updateProfileApi = async (data: UpdateProfileParam) => {
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

  if (data.middleName) formData.append('middleName', data.middleName);

  return await authenticatedTypedFetch({
    url: 'user/profile',
    method: 'PATCH',
    body: formData,
    schema: userProfileResponseSchema,
  });
};
