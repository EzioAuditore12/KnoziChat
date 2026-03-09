import { useCallback, useEffect, useRef } from 'react';
import { AppStateStatus } from 'react-native';
import { syncDatabase } from '@/db/sync';
import { useAppState } from '@/hooks/use-app-state';
import { useAuthStore } from '@/store/auth';

import { registerBackgroundSyncTask } from './background';

const POLLING_INTERVAL_MS = 1000 * 60 * 10; // e.g., run every 10 minutes while app is open

export function useSyncEngine() {
  const { user } = useAuthStore((state) => state);
  const isSyncing = useRef(false);

  // Core syncing logic
  const runForegroundSync = useCallback(async () => {
    if (!user || isSyncing.current) return;

    try {
      isSyncing.current = true;
      console.log(`[Foreground Sync] Running at ${new Date().toISOString()}`);
      await syncDatabase.pullChanges();
    } catch (error) {
      console.error('[Foreground Sync] Failed:', error);
    } finally {
      isSyncing.current = false;
    }
  }, [user]);

  // 1. Run sync immediately when app comes to the foreground
  useAppState((status: AppStateStatus) => {
    if (status === 'active') {
      runForegroundSync();
    }
  });

  // 2. Set up polling interval & register background task when authenticated
  useEffect(() => {
    if (!user) return; // Only sync if the user is logged in

    // Register the background (suspended/closed) task
    registerBackgroundSyncTask();

    // Trigger an initial foreground sync
    runForegroundSync();

    // Setup an interval to sync continuously while the app remains open
    const intervalId = setInterval(runForegroundSync, POLLING_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [user, runForegroundSync]);
}
