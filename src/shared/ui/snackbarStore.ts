import { create } from 'zustand';
import { Platform } from 'react-native';
import type { SnackbarHostRef } from '@expo/ui/jetpack-compose';

export type SnackbarAction = {
  label: string;
  onPress: () => void;
};

export type SnackbarPayload = {
  message: string;
  action?: SnackbarAction;
  /** M3: ~4s short, ~10s long; default 4s, 6s with action. */
  duration?: number;
};

type SnackbarState = {
  current: SnackbarPayload | null;
  /** Android strip accepts taps only while a snackbar is up. */
  androidVisible: boolean;
  show: (message: string, options?: Omit<SnackbarPayload, 'message'>) => void;
  hide: () => void;
  setAndroidVisible: (visible: boolean) => void;
};

/** iOS / fallback host state. */
export const useSnackbarStore = create<SnackbarState>((set) => ({
  current: null,
  androidVisible: false,
  show: (message, options) =>
    set({
      current: {
        message,
        action: options?.action,
        duration: options?.duration ?? (options?.action ? 6000 : 4000),
      },
    }),
  hide: () => set({ current: null }),
  setAndroidVisible: (androidVisible) => set({ androidVisible }),
}));

let androidHost: SnackbarHostRef | null = null;

/** Wired by `SnackbarHost` on Android. */
export function bindAndroidSnackbarHost(ref: SnackbarHostRef | null) {
  androidHost = ref;
}

/**
 * Imperative helper for non-React call sites.
 * Android → Expo UI SnackbarHost; iOS → RN fallback store.
 */
export function showSnackbar(
  message: string,
  options?: Omit<SnackbarPayload, 'message'>,
) {
  if (Platform.OS === 'android' && androidHost) {
    const duration =
      options?.duration != null
        ? options.duration >= 8000
          ? 'long'
          : 'short'
        : options?.action
          ? 'long'
          : 'short';

    useSnackbarStore.getState().setAndroidVisible(true);
    void androidHost
      .showSnackbar({
        message,
        actionLabel: options?.action?.label,
        duration,
      })
      .then((result) => {
        if (result === 'actionPerformed') {
          options?.action?.onPress();
        }
      })
      .finally(() => {
        useSnackbarStore.getState().setAndroidVisible(false);
      });
    return;
  }

  useSnackbarStore.getState().show(message, options);
}
