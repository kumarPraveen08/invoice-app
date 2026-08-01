import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

const mmkv = createMMKV({ id: 'invoice-app' });

export const mmkvStorage: StateStorage = {
  setItem: (name, value) => {
    mmkv.set(name, value);
  },
  getItem: (name) => mmkv.getString(name) ?? null,
  removeItem: (name) => {
    mmkv.remove(name);
  },
};
