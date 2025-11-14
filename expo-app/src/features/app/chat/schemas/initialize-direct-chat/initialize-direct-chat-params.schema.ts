import { z } from 'zod';

export const initializeDirectChatParamsSchema = z.object({
  receiverId: z.uuid(),
  text: z.string().max(1000),
});

export type InitializeDirectChatParams = z.infer<
  typeof initializeDirectChatParamsSchema
>;
