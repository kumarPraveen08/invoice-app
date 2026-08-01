import { create } from 'zustand';

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
  show: (message: string, options?: Omit<SnackbarPayload, 'message'>) => void;
  hide: () => void;
};

export const useSnackbarStore = create<SnackbarState>((set) => ({
  current: null,
  show: (message, options) =>
    set({
      current: {
        message,
        action: options?.action,
        duration:
          options?.duration ?? (options?.action ? 6000 : 4000),
      },
    }),
  hide: () => set({ current: null }),
}));

/** Imperative helper for non-React call sites. */
export function showSnackbar(
  message: string,
  options?: Omit<SnackbarPayload, 'message'>,
) {
  useSnackbarStore.getState().show(message, options);
}
