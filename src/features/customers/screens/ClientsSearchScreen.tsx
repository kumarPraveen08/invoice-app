import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Text, useTheme } from '@/shared/design-system';
import { SearchField } from '@/shared/ui';
import { SettingsFlatList } from '@/features/settings/components/SettingsScroll';
import { ClientRow } from '../components/ClientRow';
import { useClientsStore } from '../store';

export default function ClientsSearchScreen() {
  const { space } = useTheme();
  const clients = useClientsStore((s) => s.clients);
  const [query, setQuery] = useState('');

  const q = query.trim();
  const results = useMemo(() => {
    if (!q) return [];
    const needle = q.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(needle) ||
        client.businessName.toLowerCase().includes(needle) ||
        client.phone.toLowerCase().includes(needle) ||
        client.email.toLowerCase().includes(needle),
    );
  }, [clients, q]);

  return (
    <SettingsFlatList
      includeTopInset
      data={results}
      keyExtractor={(client) => client.id}
      title="Results"
      ListHeaderComponent={
        <View style={{ marginBottom: space.lg }}>
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder="Search clients"
          />
          {!q ? (
            <Text
              variant="body"
              muted
              style={{ marginLeft: space.md, marginTop: space.lg }}
            >
              Search by name, business, phone, or email
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
      renderItem={(client, index) => (
        <ClientRow client={client} last={index === results.length - 1} />
      )}
    />
  );
}
