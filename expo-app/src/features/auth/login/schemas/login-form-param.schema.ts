import { z } from 'zod';
import { isMobilePhone } from 'validator';

export const loginFormParamsSchema = z.object({
  phoneNumber: z.string().refine((val) => isMobilePhone(val), {
    error: 'Number should be a valid phone number',
  }),
  password: z.string().nonempty(),
});

export type LoginFormParams = z.infer<typeof loginFormParamsSchema>;
