import { type } from 'arktype';

import { userSchema } from '@/features/common/schemas/user.schema';

export const updateProfileParamSchema = userSchema
  .omit('id', 'createdAt', 'updatedAt', 'email', 'phoneNumber', 'middleName', 'avatar', 'username')
  .and({
    middleName: type('0 < string <= 50').or('undefined'),
    avatar: type(
      type({
        uri: 'string',
        name: 'string',
        type: 'string',
      })
    ).or('undefined'),
  });

export type UpdateProfileParam = typeof updateProfileParamSchema.infer;
