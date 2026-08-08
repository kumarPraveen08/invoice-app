import { create } from 'zustand';

type TabBarVisibilityState = {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
  show: () => void;
};

/** Shared by tab screens (`SettingsScroll`) and `FloatingTabBar`. */
export const useTabBarVisibility = create<TabBarVisibilityState>((set) => ({
  hidden: false,
  setHidden: (hidden) => set({ hidden }),
  show: () => set({ hidden: false }),
}));
