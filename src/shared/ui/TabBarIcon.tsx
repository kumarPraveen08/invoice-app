import Ionicons from '@expo/vector-icons/Ionicons';
import type { ColorValue } from 'react-native';
import { tabBar } from '@/shared/design-system';

type IconPair = {
  active: keyof typeof Ionicons.glyphMap;
  inactive: keyof typeof Ionicons.glyphMap;
};

const ICONS = {
  invoices: { active: 'receipt', inactive: 'receipt-outline' },
  catalogue: { active: 'grid', inactive: 'grid-outline' },
  clients: { active: 'people', inactive: 'people-outline' },
  reports: { active: 'bar-chart', inactive: 'bar-chart-outline' },
  tools: { active: 'settings', inactive: 'settings-outline' },
} as const satisfies Record<string, IconPair>;

export type TabName = keyof typeof ICONS;

type Props = {
  name: TabName;
  focused: boolean;
  color: ColorValue;
};

export function TabBarIcon({ name, focused, color }: Props) {
  const pair = ICONS[name];
  return (
    <Ionicons
      name={focused ? pair.active : pair.inactive}
      size={tabBar.iconSize}
      color={color}
    />
  );
}
