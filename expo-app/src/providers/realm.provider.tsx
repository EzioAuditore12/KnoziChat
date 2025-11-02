import { RealmProvider } from '@realm/react';
import type { PropsWithChildren } from 'react';

export function RealmDBProvider({ children }: PropsWithChildren) {
  return <RealmProvider deleteRealmIfMigrationNeeded>{children}</RealmProvider>;
}
