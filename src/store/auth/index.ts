import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { zustandStorage } from '../storage';
import type { AuthStore } from './types';

import { powerSyncDb } from '@/db';
import { useDeviceConfigStore } from '../device';

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,

      setUserDetails(data) {
        set({ user: data });
      },

      setUserTokens(data) {
        set({ tokens: data });
      },

      logout: async () => {
        await powerSyncDb.disconnectAndClear();

        useDeviceConfigStore.getState().resetTimeStamp();

        set({ user: null, tokens: null });
      },
    }),
    {
      name: 'knozichat-auth',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
