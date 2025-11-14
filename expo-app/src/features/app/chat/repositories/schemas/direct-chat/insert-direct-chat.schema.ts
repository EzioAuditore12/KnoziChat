import { z } from 'zod';

import { objectIdSchema } from '@/lib/schema';

export const createDirectChatParamsSchema = z.object({
  _id: objectIdSchema,
  conversationId: z.string(),
  text: z.string(),
  mode: z.enum(['SENT', 'RECEIVED']),
  isDelivered: z.boolean().default(false),
  isSeen: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateDirectChatParams = z.infer<
  typeof createDirectChatParamsSchema
>;
