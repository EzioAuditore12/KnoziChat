import { type } from 'arktype';

export const authorizeDownloadParamSchema = type({
  url: 'string.url',
});

export type AuthorizeDownloadParam = typeof authorizeDownloadParamSchema.infer;
