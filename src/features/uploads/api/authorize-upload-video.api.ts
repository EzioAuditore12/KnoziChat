import { authenticatedTypedFetch } from '@/lib/auth.api';

import { UploadVideoParam } from '../schemas/video/param.schema';
import { uploadVideoResponseSchema } from '../schemas/video/response.schema';

export const authorizeUploadVideoApi = async (data: UploadVideoParam) => {
  return await authenticatedTypedFetch({
    url: 'uploads/video',
    method: 'POST',
    body: data,
    schema: uploadVideoResponseSchema,
  });
};
