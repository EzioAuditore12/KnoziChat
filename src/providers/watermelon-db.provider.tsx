import { DatabaseProvider, withDatabase } from '@nozbe/watermelondb/react';
import type { PropsWithChildren } from 'react';

import { database } from '@/db';

export function WatermelondbProvider({ children }: PropsWithChildren) {
  return <DatabaseProvider database={database}>{children}</DatabaseProvider>;
}

export { withDatabase };
