import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { database } from '@/db';

import { setLastSyncZero } from '@/db/core/pull-synchronizer';
import { zustandStorage } from '../storage';
import type { AuthStore } from './types';

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
        await database.write(async () => {
          await database.unsafeResetDatabase();
        });

        setLastSyncZero();

        set({ user: null, tokens: null });
      },
    }),
    {
      name: 'Knozichat',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
