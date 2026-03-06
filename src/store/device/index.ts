import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '../storage';
import type { DeviceConfigStoreType } from './type';

export const useDeviceConfigStore = create<DeviceConfigStoreType>()(
  persist(
    (set, get) => ({
      expoPushToken: null,
      lastSyncedAt: 0,
      setExpoPushToken: (token: string) => {
        set({ expoPushToken: token });
      },
      clearExpoPushToken: () => {
        set({ expoPushToken: null });
      },
      getLastSyncedAt() {
        const { lastSyncedAt } = get();
        return lastSyncedAt;
      },
      updateLastSynedAt(data) {
        set({ lastSyncedAt: data });
      },
      resetTimeStamp() {
        set({ lastSyncedAt: 0 });
      },
    }),
    {
      name: 'device-settings',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
