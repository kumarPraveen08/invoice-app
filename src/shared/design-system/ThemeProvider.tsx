import { createContext, useDeferredValue, useMemo, type ReactNode } from 'react';
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
  // Defer palette apply so the press (selection ring / sheet dismiss) stays snappy;
  // Compose Hosts + full tree theming are the expensive part.
  const deferredPreference = useDeferredValue(preference);
  const deferredSeed = useDeferredValue(seed);

  const theme = useMemo(() => {
    const mode =
      deferredPreference === 'system'
        ? scheme === 'dark'
          ? 'dark'
          : 'light'
        : deferredPreference;
    return createTheme(mode, deferredSeed);
  }, [deferredPreference, scheme, deferredSeed]);

  return <ThemeContext value={theme}>{children}</ThemeContext>;
}
