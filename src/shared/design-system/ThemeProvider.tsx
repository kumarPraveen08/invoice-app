import { createContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, type Theme, type ThemeMode } from './theme';

export type ThemeContextValue = Theme;

export const ThemeContext = createContext<ThemeContextValue>(lightTheme);

type Props = {
  children: ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const scheme = useColorScheme();
  const mode: ThemeMode = scheme === 'dark' ? 'dark' : 'light';
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext value={theme}>{children}</ThemeContext>
  );
}
