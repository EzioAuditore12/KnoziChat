import { type } from 'arktype';

export const groupDetailsSchema = type({
  id: 'string',
  name: 'string',
  avatar: 'string.url | null',
  createdAt: 'string.date.iso',
  updatedAt: 'string.date.iso',
});
