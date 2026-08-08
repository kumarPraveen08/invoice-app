import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Text, useTheme } from '@/shared/design-system';
import { SearchField } from '@/shared/ui';
import { SettingsFlatList } from '@/features/settings/components/SettingsScroll';
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
    <SettingsFlatList
      includeTopInset
      data={results}
      keyExtractor={(item) => item.id}
      title="Results"
      ListHeaderComponent={
        <View style={{ marginBottom: space.lg }}>
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder="Search catalogue"
          />
          {!q ? (
            <Text
              variant="body"
              muted
              style={{ marginLeft: space.md, marginTop: space.lg }}
            >
              Search by name, SKU, or category
            </Text>
          ) : null}
        </View>
      }
      ListEmptyComponent={
        q ? (
          <Text variant="body" muted style={{ marginLeft: space.md }}>
            No results for “{q}”
          </Text>
        ) : null
      }
      renderItem={(item, index) => (
        <CatalogueRow
          item={item}
          currency={currency}
          last={index === results.length - 1}
        />
      )}
    />
  );
}
