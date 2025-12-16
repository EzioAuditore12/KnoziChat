import { type } from 'arktype';

import { objectIdSchema } from '@/lib/schemas';

export const chatSchema = type({
  _id: objectIdSchema,
  senderId: 'string.uuid',
  receiverId: 'string.uuid',
  delivered: 'boolean',
  text: '0 < string <= 1000',
  seen: 'boolean',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
});

export type Chat = typeof chatSchema.infer;
