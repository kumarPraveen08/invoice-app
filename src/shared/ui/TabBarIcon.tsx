import type { ColorValue } from 'react-native';
import { Icon, tabBar, type IconName } from '@/shared/design-system';

type IconPair = {
  active: IconName;
  inactive: IconName;
};

const ICONS = {
  invoices: { active: 'receipt', inactive: 'receipt' },
  catalogue: { active: 'grid-view', inactive: 'grid-view' },
  clients: { active: 'people', inactive: 'people-outline' },
  reports: { active: 'bar-chart', inactive: 'bar-chart' },
  tools: { active: 'settings', inactive: 'settings' },
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
    <Icon
      name={focused ? pair.active : pair.inactive}
      size={tabBar.iconSize}
      color={color}
    />
  );
}
