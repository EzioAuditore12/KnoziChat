import { type } from 'arktype';

export const askAiResponseSchema = type({
  response: 'string',
});

export type AskAiResponse = typeof askAiResponseSchema.infer;
