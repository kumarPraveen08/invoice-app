import { useMemo } from 'react';
import { EmptyState } from '@/shared/ui';
import { SettingsGroup } from '@/features/settings/components/SettingsList';
import { SettingsScroll } from '@/features/settings/components/SettingsScroll';
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
    <SettingsScroll withTabBar>
      {sections.length === 0 ? (
        <EmptyState
          title="No catalogue yet"
          description="Use + to add products or services."
        />
      ) : (
        sections.map((section) => (
          <SettingsGroup key={section.title} title={section.title}>
            {section.data.map((item, index) => (
              <CatalogueRow
                key={item.id}
                item={item}
                currency={currency}
                last={index === section.data.length - 1}
              />
            ))}
          </SettingsGroup>
        ))
      )}
    </SettingsScroll>
  );
}
