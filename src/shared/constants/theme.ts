import {
  darkColors,
  fab,
  lightColors,
  tabBar,
  type ThemeMode,
} from '@/shared/design-system';

/** @deprecated Use useTheme() from @/shared/design-system instead */
export const colors = {
  light: {
    primary: lightColors.primary,
    primaryContrast: lightColors.onPrimary,
    tabBarBg: lightColors.tabBar,
    tabInactive: lightColors.tabInactive,
    tabBorder: 'transparent',
    screenBg: lightColors.background,
    text: lightColors.onSurface,
    textMuted: lightColors.onSurfaceMuted,
    iconBg: lightColors.iconSoft,
    shadow: lightColors.shadow,
  },
  dark: {
    primary: darkColors.primary,
    primaryContrast: darkColors.onPrimary,
    tabBarBg: darkColors.tabBar,
    tabInactive: darkColors.tabInactive,
    tabBorder: 'transparent',
    screenBg: darkColors.background,
    text: darkColors.onSurface,
    textMuted: darkColors.onSurfaceMuted,
    iconBg: darkColors.iconSoft,
    shadow: darkColors.shadow,
  },
} as const;

export { fab, tabBar, type ThemeMode };
