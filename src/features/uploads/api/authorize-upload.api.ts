import { authenticatedTypedFetch } from '@/lib/auth.api';
import { AuthroizeUploadPram } from '../schemas/authorize-upload/param.schema';
import { authorizeUploadResponseSchema } from '../schemas/authorize-upload/response.schema';

export const authorizeUploadApi = async (data: AuthroizeUploadPram) => {
  return await authenticatedTypedFetch({
    url: 'uploads/authorize',
    method: 'POST',
    body: data,
    schema: authorizeUploadResponseSchema,
  });
};
