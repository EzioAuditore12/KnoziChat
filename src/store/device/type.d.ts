export type AppTheme = 'light' | 'dark' | 'system';

interface DeviceConfigStoreType {
  expoPushToken: string | null;
  lastSyncedAt: number;

  theme: AppTheme;

  setTheme: (theme: AppTheme) => void;

  setExpoPushToken: (token: string) => void;
  clearExpoPushToken: () => void;

  getLastSyncedAt: () => number;
  updateLastSynedAt: (data: number) => void;
  resetTimeStamp: () => void;
}
