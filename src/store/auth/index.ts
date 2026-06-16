import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { secureStorage } from '../storage';
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

        const { useSocketState } = await import('../socket');
        useSocketState.getState().disconnectSocket();

        useDeviceConfigStore.getState().resetTimeStamp();

        set({ user: null, tokens: null });
      },
    }),
    {
      name: 'knozichat-auth',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
