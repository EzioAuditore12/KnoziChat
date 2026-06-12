import { authenticatedTypedFetch } from '@/lib/auth-fetch';

import { UploadImageParam } from '../schemas/image/param.schema';
import { uploadImageResponseSchema } from '../schemas/image/response.schema';

export const authorizeUploadImageApi = async (data: UploadImageParam) => {
  return await authenticatedTypedFetch({
    url: 'uploads/image',
    method: 'POST',
    body: data,
    schema: uploadImageResponseSchema,
  });
};
