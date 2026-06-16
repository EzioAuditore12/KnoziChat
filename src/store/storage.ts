import { StateStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import * as Keychain from 'react-native-keychain';

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
  setItem: async (name, value) => {
    await Keychain.setGenericPassword(name, value, { service: name });
  },
  getItem: async (name) => {
    const credentials = await Keychain.getGenericPassword({ service: name });
    return credentials ? credentials.password : null;
  },
  removeItem: async (name) => {
    await Keychain.resetGenericPassword({ service: name });
  },
};
