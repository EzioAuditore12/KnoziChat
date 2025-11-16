import { z } from 'zod';

import { watermelonDBIdSchema } from '@/lib/schema';
import { userSchema } from '@/features/app/user/repositories/schemas/user.schema';

export const conversationSchema = z.object({
  id: watermelonDBIdSchema,
  contact: z.string(),
  user: userSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Conversation = z.infer<typeof conversationSchema>;
