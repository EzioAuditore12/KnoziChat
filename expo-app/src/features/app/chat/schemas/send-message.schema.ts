import { z } from 'zod';

export const sendTextMessage = z.object({
  text: z.string().max(1000),
});
