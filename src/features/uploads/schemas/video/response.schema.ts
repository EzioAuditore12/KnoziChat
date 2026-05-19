import { type } from 'arktype';

import { jwtTokenSchema } from '@/lib/schemas';

export const uploadVideoResponseSchema = type({
  allowed: 'boolean',
  url: 'string.url',
  projectId: 'string',
  bucketId: 'string',
  endpoint: 'string',
  authorizationToken: jwtTokenSchema,
  requiredHeaders: {
    'x-appwrite-project': '"x-appwrite-project"',
    'x-appwrite-jwt': '"x-appwrite-jwt"',
    'content-range': '"content-range"',
    'x-appwrite-id': '"x-appwrite-id"',
  },
});

export type UploadVideoResponse = typeof uploadVideoResponseSchema.infer;
