import * as s from 'standard-parse';

import { fetch, FetchProps, HttpMethods } from './fetch';
import { env } from '@/env';
import { useAuthStore } from '@/store/auth';
import { refreshAccessToken } from './token-manager';

interface AuthenticatedFetchProps extends Omit<FetchProps, 'body' | 'method'> {
  baseUrl?: string;
  url: string;
  responseStatus?: number;
  method: HttpMethods;
  body?: object;
}

export const authenticatedFetch = async ({
  baseUrl = env.API_URL,
  url,
  headers,
  responseStatus = 401,
  body,
  method,
  ...props
}: AuthenticatedFetchProps) => {
  const accessToken = useAuthStore.getState().tokens?.accessToken;

  if (!accessToken) throw new Error('No authentication token provided');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    ...(headers || {}),
  };

  const requestOptions = {
    method,
    body: body ? JSON.stringify(body) : undefined,
  };

  const apiUrl = `${baseUrl}/${url}`;

  let response = await fetch(apiUrl, {
    ...requestOptions,
    headers: authHeaders,
    ...props,
  });

  if (response.status === responseStatus) {
    try {
      // 1. Call the shared refresh logic
      await refreshAccessToken();

      // 2. Get new token
      const newAccessToken = useAuthStore.getState().tokens?.accessToken;

      // 3. Update headers
      authHeaders.Authorization = `Bearer ${newAccessToken}`;

      // 4. Retry request
      response = await fetch(apiUrl, {
        ...requestOptions,
        headers: authHeaders,
        ...props,
      });
    } catch (error) {
      alert('Session expired. Please login again.');
      throw error;
    }
  }

  const json = await response.json();
  return json;
};

interface TypedAuthenticatedFetchProps<
  S extends s.StandardSchemaV1,
> extends AuthenticatedFetchProps {
  method: HttpMethods;
  schema: S;
  body?: object | FormData;
  query?: object;
  contentType?: string | null;
}

export const authenticatedTypedFetch = async <S extends s.StandardSchemaV1>({
  baseUrl = `${env.API_URL}`,
  url,
  headers,
  responseStatus = 401,
  body,
  schema,
  query,
  method,
  contentType = 'application/json',
  ...props
}: TypedAuthenticatedFetchProps<S>): Promise<s.StandardSchemaV1.InferOutput<S>> => {
  const accessToken = useAuthStore.getState().tokens?.accessToken;

  if (!accessToken) throw new Error('No authentication token provided');
  let authHeaders: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    ...((headers as Record<string, string>) || {}),
  };

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  // Only set JSON content-type when not sending FormData and not already provided.
  // If caller explicitly passes `null` for `contentType`, skip adding the header.
  if (!isFormData && contentType !== null && !authHeaders['Content-Type']) {
    authHeaders['Content-Type'] = contentType;
  }

  const requestOptions = {
    method,
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  };

  if (query !== undefined) {
    const paramsValues = new URLSearchParams(query as Record<string, string>).toString();
    url = url + (url.includes('?') ? '&' : '?') + paramsValues;
  }

  const apiUrl = `${baseUrl}/${url}`;

  let response = await fetch(apiUrl, {
    ...requestOptions,
    headers: authHeaders,
    ...props,
  });

  if (response.status === responseStatus) {
    try {
      // 1. Call shared refresh logic
      await refreshAccessToken();

      // 2. Get new token
      const newAccessToken = useAuthStore.getState().tokens?.accessToken;

      authHeaders = {
        Authorization: `Bearer ${newAccessToken}`,
        ...((headers as Record<string, string>) || {}),
      };

      // Preserve the same Content-Type behavior on retry: only set it when
      // not sending FormData and the caller didn't explicitly request skipping it.
      if (!isFormData && contentType !== null && !authHeaders['Content-Type']) {
        authHeaders['Content-Type'] = contentType;
      }

      // 4. Retry request
      response = await fetch(apiUrl, {
        ...requestOptions,
        headers: authHeaders,
        ...props,
      });
    } catch (error) {
      alert('Session expired. Please login again.');
      throw error;
    }
  }

  const json = await response.json();

  const result = s.safeParse(schema, json);

  if (result.issues) throw new Error(JSON.stringify(result.issues));

  return result.value;
};
