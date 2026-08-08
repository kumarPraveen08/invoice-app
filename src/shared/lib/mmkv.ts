import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

const mmkv = createMMKV({ id: 'invoice-app' });

/** Queue writes so theme taps are not blocked by serializing the full settings blob. */
const pending = new Map<string, string>();
let flushScheduled = false;

function flushPending() {
  flushScheduled = false;
  for (const [key, value] of pending) {
    mmkv.set(key, value);
  }
  pending.clear();
}

export const mmkvStorage: StateStorage = {
  setItem: (name, value) => {
    pending.set(name, value);
    if (flushScheduled) return;
    flushScheduled = true;
    queueMicrotask(flushPending);
  },
  getItem: (name) => {
    if (pending.has(name)) return pending.get(name)!;
    return mmkv.getString(name) ?? null;
  },
  removeItem: (name) => {
    pending.delete(name);
    mmkv.remove(name);
  },
};
