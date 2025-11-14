import { z } from 'zod';

import { userSchema } from '../../schemas/user.schema';

export const insertUserParamsSchema = userSchema;

export type InsertUserParams = z.infer<typeof insertUserParamsSchema>;
