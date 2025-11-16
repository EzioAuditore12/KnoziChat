import { z } from 'zod';

export const userSchema = z.object({
  id: z.uuid(),
  firstName: z.string().max(50),
  middleName: z.string().max(50).nullable(),
  lastName: z.string().max(50),
  phoneNumber: z.string(),
  email: z.email().nullable(),
  avatar: z.url().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type User = z.infer<typeof userSchema>;
