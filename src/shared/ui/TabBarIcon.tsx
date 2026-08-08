import type { ColorValue } from 'react-native';
import { Icon, tabBar, type IconName } from '@/shared/design-system';

const ICONS = {
  invoices: 'receipt',
  catalogue: 'grid-view',
  clients: 'people',
  reports: 'bar-chart',
  tools: 'settings',
} as const satisfies Record<string, IconName>;

export type TabName = keyof typeof ICONS;

type Props = {
  name: TabName;
  color: ColorValue;
};

export function TabBarIcon({ name, color }: Props) {
  return <Icon name={ICONS[name]} size={tabBar.iconSize} color={color} />;
}
