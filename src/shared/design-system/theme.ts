import {
  darkColors,
  elevation,
  fab,
  lightColors,
  radii,
  space,
  tabBar,
  typography,
  type ColorPalette,
} from './tokens';

export type ThemeMode = 'light' | 'dark';

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

export const lightTheme: Theme = {
  mode: 'light',
  colors: lightColors,
  space,
  typography,
  radii,
  elevation,
  layout: { tabBar, fab },
};

export const darkTheme: Theme = {
  mode: 'dark',
  colors: darkColors,
  space,
  typography,
  radii,
  elevation,
  layout: { tabBar, fab },
};

export const themes: Record<ThemeMode, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};
