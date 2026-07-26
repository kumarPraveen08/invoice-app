export const colors = {
  light: {
    primary: '#6A5AE0',
    primaryContrast: '#FFFFFF',
    tabBarBg: '#1A1A1A',
    tabInactive: '#8B93A7',
    tabBorder: 'transparent',
    screenBg: '#F5F5F5',
    text: '#212121',
    textMuted: '#757575',
    iconBg: '#EDE9FF',
    shadow: '#000000',
  },
  dark: {
    primary: '#6A5AE0',
    primaryContrast: '#FFFFFF',
    tabBarBg: '#1A1A1A',
    tabInactive: '#8B93A7',
    tabBorder: 'transparent',
    screenBg: '#121212',
    text: '#E0E0E0',
    textMuted: '#9E9E9E',
    iconBg: '#2A2545',
    shadow: '#000000',
  },
} as const;

export type ThemeMode = keyof typeof colors;

export const tabBar = {
  height: 64,
  iconSize: 22,
  labelSize: 13,
  borderRadius: 999,
  elevation: 16,
  marginHorizontal: 20,
  marginBottom: 8,
  pillPaddingH: 14,
  pillPaddingV: 10,
} as const;

export const fab = {
  size: 56,
  iconSize: 28,
  marginRight: 20,
  gapAboveTabBar: 16,
} as const;
