import { create } from 'zustand';

type TabBarVisibilityState = {
  /** Floating tab bar is mounted (tab navigator visible). */
  present: boolean;
  /** Scrolled away / animating off-screen. */
  hidden: boolean;
  setPresent: (present: boolean) => void;
  setHidden: (hidden: boolean) => void;
  show: () => void;
};

/** Shared by tab screens (`SettingsScroll`), `FloatingTabBar`, and snackbar. */
export const useTabBarVisibility = create<TabBarVisibilityState>((set) => ({
  present: false,
  hidden: false,
  setPresent: (present) => set({ present }),
  setHidden: (hidden) => set({ hidden }),
  show: () => set({ hidden: false }),
}));
