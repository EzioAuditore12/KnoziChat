import { type } from 'arktype';

export const verifyRegisterationParamSchema = type({
  otp: '0 < string <= 6',
  email: '0 < string.email <= 240',
});

export type VerifyRegisterationParam = typeof verifyRegisterationParamSchema.infer;
