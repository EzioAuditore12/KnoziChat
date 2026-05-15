import { FetchRequestInit } from 'expo/fetch';

import { fetch } from 'react-native-nitro-fetch';
import * as s from 'standard-parse';

export type FetchProps = FetchRequestInit;

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface TypedFetchProps<S extends s.StandardSchemaV1> extends Omit<
  FetchRequestInit,
  'method' | 'body'
> {
  url: string;
  schema: S;
  method: HttpMethods;
  query?: object;
  body?: object | FormData;
  contentType?: string | null;
}

export { fetch };

export const typedFetch = async <S extends s.StandardSchemaV1>({
  url,
  schema,
  headers,
  query,
  method,
  body,
  contentType = 'application/json',
  ...props
}: TypedFetchProps<S>): Promise<s.StandardSchemaV1.InferOutput<S>> => {
  let typedFetchHeader: Record<string, string> = {
    ...((headers as Record<string, string>) || {}),
  };

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (!isFormData && contentType !== null && !typedFetchHeader['Content-Type']) {
    typedFetchHeader['Content-Type'] = contentType;
  }

  if (query !== undefined) {
    const paramsValues = new URLSearchParams(query as Record<string, string>).toString();

    url = url + (url.includes('?') ? '&' : '?') + paramsValues;
  }

  const response = await fetch(url, {
    headers: typedFetchHeader,
    method: method,
    body: isFormData ? (body as FormData) : body ? JSON.stringify(body) : undefined,
    ...props,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    try {
      const errorJson = JSON.parse(errorBody);
      throw new Error(errorJson.message || JSON.stringify(errorJson));
    } catch {
      throw new Error(errorBody || response.statusText);
    }
  }

  const json = await response.json();

  const result = s.safeParse(schema, json);

  if (result.issues) throw new Error(JSON.stringify(result.issues));

  return result.value;
};
