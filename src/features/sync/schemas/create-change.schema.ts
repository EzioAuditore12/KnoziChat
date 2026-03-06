import { type, type Type } from 'arktype';

export const createChangesSchema = <T extends Type>(schema: T) =>
  type({
    created: schema.array(),
    updated: schema.array(),
    deleted: 'string[]',
  }) as Type<{
    created: T['infer'][];
    updated: T['infer'][];
    deleted: string[];
  }>;
