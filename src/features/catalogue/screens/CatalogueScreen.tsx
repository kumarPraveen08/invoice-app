import { useMemo } from 'react';
import { EmptyState } from '@/shared/ui';
import { SettingsSectionList } from '@/features/settings/components/SettingsScroll';
import { useSettingsStore } from '@/features/settings/store';
import { CatalogueRow } from '../components/CatalogueRow';
import { useCatalogueStore } from '../store';
import type { CatalogueItem } from '../types';

function groupByCategory(items: CatalogueItem[]) {
  const map = new Map<string, CatalogueItem[]>();
  for (const item of items) {
    const list = map.get(item.category) ?? [];
    list.push(item);
    map.set(item.category, list);
  }
  return [...map.entries()].map(([title, data]) => ({ title, data }));
}

export default function CatalogueScreen() {
  const currency = useSettingsStore((s) => s.preferences.currency);
  const items = useCatalogueStore((s) => s.items);
  const sections = useMemo(() => groupByCategory(items), [items]);

  return (
    <SettingsSectionList
      withTabBar
      sections={sections}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <EmptyState
          title="No catalogue yet"
          description="Use + to add products or services."
        />
      }
      renderItem={(item, index, section) => (
        <CatalogueRow
          item={item}
          currency={currency}
          last={index === section.data.length - 1}
        />
      )}
    />
  );
}
