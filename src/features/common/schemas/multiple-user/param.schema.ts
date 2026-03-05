import { type } from 'arktype';

export const multipleUsersParamSchema = type({ participants: 'string.uuid[]' });

export type MultipleUsersParam = typeof multipleUsersParamSchema.infer;
