import { z } from 'zod';

import { userSchema as BackendUserSchema } from '../../schemas/user.schema';

export const userSchema = BackendUserSchema.extend({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;
