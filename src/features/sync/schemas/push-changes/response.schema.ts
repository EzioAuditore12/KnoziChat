import { type } from 'arktype';

const changeResponse = type({
  recordId: 'string',
  serverId: 'string',
  serverUpdatedAt: 'number',
  error: 'string?',
});

export const pushChangeResponse = type({
  success: 'boolean',
  results: changeResponse.array(),
});
