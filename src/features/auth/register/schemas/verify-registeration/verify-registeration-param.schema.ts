import { type } from 'arktype';

import { phoneSchema } from '@/lib/schemas';

export const verifyRegisterationParamSchema = type({
  otp: '0 < string <= 6',
  phoneNumber: phoneSchema,
});

export type VerifyRegisterationParam = typeof verifyRegisterationParamSchema.infer;
