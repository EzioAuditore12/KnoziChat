import { z } from 'zod';

import { objectIdSchema } from '@/lib/schema';

export const initializeDirectChatResponseSchema = z.object({
  status: z.string(),
  message: z.string(),
  data: z.object({
    _id: objectIdSchema,
    senderId: z.uuid(),
    receiverId: z.uuid(),
    delivered: z.boolean(),
    text: z.string().max(1000),
    seen: z.boolean(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  }),
});

export type IntializeDirectChatResponse = z.infer<
  typeof initializeDirectChatResponseSchema
>;
