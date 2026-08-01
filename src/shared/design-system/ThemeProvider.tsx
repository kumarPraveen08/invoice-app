import { createContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { useSettingsStore } from '@/features/settings/store';
import { createTheme, lightTheme, type Theme } from './theme';

export type ThemeContextValue = Theme;

export const ThemeContext = createContext<ThemeContextValue>(lightTheme);

type Props = {
  children: ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const scheme = useColorScheme();
  const preference = useSettingsStore((s) => s.appearance.mode);
  const seed = useSettingsStore((s) => s.appearance.seed);

  const theme = useMemo(() => {
    const mode =
      preference === 'system'
        ? scheme === 'dark'
          ? 'dark'
          : 'light'
        : preference;
    return createTheme(mode, seed);
  }, [preference, scheme, seed]);

  return <ThemeContext value={theme}>{children}</ThemeContext>;
}
