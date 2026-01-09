import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '../storage';
import type { DeviceConfigStoreType } from './type';

export const useDeviceConfigStore = create<DeviceConfigStoreType>()(
  persist(
    (set) => ({
      expoPushToken: null,
      setExpoPushToken: (token: string) => {
        set({ expoPushToken: token });
      },
      clearExpoPushToken: () => {
        set({ expoPushToken: null });
      },
    }),
    {
      name: 'device-settings',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
