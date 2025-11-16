import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, {
  message: 'Invalid ObjectId format',
});

export type ObjectId = z.infer<typeof objectIdSchema>;

export const watermelonDBIdSchema = z
  .string()
  .regex(/^[A-Za-z0-9]{15,17}$/, 'Invalid WatermelonDB ID');

export type WatermelonDBId = z.infer<typeof watermelonDBIdSchema>;
