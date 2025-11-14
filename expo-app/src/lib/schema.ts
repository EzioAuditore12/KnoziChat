import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, {
  message: 'Invalid ObjectId format',
});

export type ObjectId = z.infer<typeof objectIdSchema>;
