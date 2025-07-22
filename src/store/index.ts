import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "./storage";
import type { authStoreType } from "./types";

export const authStore = create<authStoreType>()(
	persist(
		(set) => ({
			user: undefined,
			tokens: undefined,
			setUser: (user) => set({ user }),
			setTokens: (tokens) => set({ tokens }),
			logout: () => {
				set({ user: undefined, tokens: undefined });
			},
		}),
		{
			name: "knozichat",
			storage: createJSONStorage(() => mmkvStorage),
		},
	),
);
