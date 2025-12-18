import { env } from '@/env';

import { typedFetch } from '@/lib/fetch';

import type { VerifyRegisterationParam } from '../schemas/verify-registeration/verify-registeration-param.schema';
import { verifyRegisterationResponseSchema } from '../schemas/verify-registeration/verify-registeration-response.schema';

export const verifyRegisterFormApi = (data: VerifyRegisterationParam) => {
  return typedFetch({
    url: `${env.API_URL}/auth/verify-register`,
    method: 'POST',
    body: data,
    schema: verifyRegisterationResponseSchema,
  });
};
