import { z } from 'zod';
import { isMobilePhone } from 'validator';

export const createConversationParamsSchema = z.object({
  userId: z.uuid(),
  contact: z.string().refine((val) => isMobilePhone(val)),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateConversationParams = z.infer<
  typeof createConversationParamsSchema
>;
