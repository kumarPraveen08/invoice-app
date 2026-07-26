import { use } from 'react';
import { ThemeContext } from './ThemeProvider';

export function useTheme() {
  return use(ThemeContext);
}
