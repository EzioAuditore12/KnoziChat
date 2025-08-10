import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { MMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

const storage = new MMKV();

export const mmkvStorage: StateStorage = {
	setItem: (name, value) => {
		return storage.set(name, value);
	},
	getItem: (name) => {
		const value = storage.getString(name);
		return value ?? null;
	},
	removeItem: (name) => {
		return storage.delete(name);
	},
};

export const Storage: StateStorage =
	Platform.OS === "web" ? AsyncStorage : mmkvStorage;
