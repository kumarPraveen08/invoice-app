import {
  createColorPalette,
  elevation,
  fab,
  radii,
  space,
  tabBar,
  typography,
  type ColorPalette,
  type ThemeSeed,
} from './tokens';

export type ThemeMode = 'light' | 'dark';
export type ThemePreference = 'system' | ThemeMode;

export type Theme = {
  mode: ThemeMode;
  colors: ColorPalette;
  space: typeof space;
  typography: typeof typography;
  radii: typeof radii;
  elevation: typeof elevation;
  layout: {
    tabBar: typeof tabBar;
    fab: typeof fab;
  };
};

export function createTheme(mode: ThemeMode, seed: ThemeSeed = 'violet'): Theme {
  return {
    mode,
    colors: createColorPalette(mode, seed),
    space,
    typography,
    radii,
    elevation,
    layout: { tabBar, fab },
  };
}

export const lightTheme: Theme = createTheme('light', 'violet');
export const darkTheme: Theme = createTheme('dark', 'violet');

export const themes: Record<ThemeMode, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};
