import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';
import { syncDatabase } from '@/db/sync';

export const BACKGROUND_SYNC_TASK = 'background-sync';

// Must be called in the global scope
TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    console.log(`[Background Sync] Running at ${new Date().toISOString()}`);
    await syncDatabase.pullChanges();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error('[Background Sync] Failed:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

// Helper to easily register the task within your React components
export async function registerBackgroundSyncTask() {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
    if (!isRegistered) {
      await BackgroundTask.registerTaskAsync(BACKGROUND_SYNC_TASK);
      console.log('[Background Sync] Task registered');
    }
  } catch (err) {
    console.error('[Background Sync] Registration failed:', err);
  }
}
