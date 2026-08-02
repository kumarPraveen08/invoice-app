import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Text, useTheme } from '@/shared/design-system';
import { SearchField } from '@/shared/ui';
import { SettingsGroup } from '@/features/settings/components/SettingsList';
import { SettingsScroll } from '@/features/settings/components/SettingsScroll';
import { useSettingsStore } from '@/features/settings/store';
import { CatalogueRow } from '../components/CatalogueRow';
import { useCatalogueStore } from '../store';

export default function CatalogueSearchScreen() {
  const { space } = useTheme();
  const currency = useSettingsStore((s) => s.preferences.currency);
  const items = useCatalogueStore((s) => s.items);
  const [query, setQuery] = useState('');

  const q = query.trim();
  const results = useMemo(() => {
    if (!q) return [];
    const needle = q.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(needle) ||
        item.sku.toLowerCase().includes(needle) ||
        item.category.toLowerCase().includes(needle),
    );
  }, [items, q]);

  return (
    <SettingsScroll includeTopInset>
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Search catalogue"
      />

      <View style={{ marginTop: space.lg }}>
        {!q ? (
          <Text variant="body" muted style={{ marginLeft: space.md }}>
            Search by name, SKU, or category
          </Text>
        ) : results.length === 0 ? (
          <Text variant="body" muted style={{ marginLeft: space.md }}>
            No results for “{q}”
          </Text>
        ) : (
          <SettingsGroup title="Results">
            {results.map((item, index) => (
              <CatalogueRow
                key={item.id}
                item={item}
                currency={currency}
                last={index === results.length - 1}
              />
            ))}
          </SettingsGroup>
        )}
      </View>
    </SettingsScroll>
  );
}
