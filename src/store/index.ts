import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Storage } from "./storage";
import type { authStoreType } from "./types";

export const useAuthStore = create<authStoreType>()(
	persist(
		(set) => ({
			user: null,
			tokens: null,
			setUser: (user) => set({ user }),
			setTokens: (tokens) => set({ tokens }),
			logout: () => {
				set({ user: undefined, tokens: undefined });
			},
		}),
		{
			name: "knozichat",
			storage: createJSONStorage(() => Storage),
		},
	),
);
