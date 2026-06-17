import { StateStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { setItem, deleteItemAsync, getItem } from 'expo-secure-store';

const storage = createMMKV();

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.remove(name);
  },
};

export const secureStorage: StateStorage = {
  setItem: (name, value) => {
    setItem(name, value);
  },
  getItem: (name) => {
    const value = getItem(name);
    return value ?? null;
  },
  removeItem: async (name) => {
    await deleteItemAsync(name);
  },
};
