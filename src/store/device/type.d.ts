export type DeviceConfigStoreType = {
  expoPushToken: string | null;
  lastSyncedAt: number;
  setExpoPushToken: (token: string) => void;
  clearExpoPushToken: () => void;
  getLastSyncedAt: () => number;
  updateLastSynedAt: (data: number) => void;
  resetTimeStamp: () => void;
};
