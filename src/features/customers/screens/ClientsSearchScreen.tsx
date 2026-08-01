import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Text, useTheme } from '@/shared/design-system';
import { SearchField } from '@/shared/ui';
import { SettingsGroup } from '@/features/settings/components/SettingsList';
import { SettingsScroll } from '@/features/settings/components/SettingsScroll';
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
    <SettingsScroll includeTopInset>
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder="Search clients"
      />

      <View style={{ marginTop: space.lg }}>
        {!q ? (
          <Text variant="body" muted style={{ marginLeft: space.md }}>
            Search by name, business, phone, or email
          </Text>
        ) : results.length === 0 ? (
          <Text variant="body" muted style={{ marginLeft: space.md }}>
            No results for “{q}”
          </Text>
        ) : (
          <SettingsGroup title="Results">
            {results.map((client, index) => (
              <ClientRow
                key={client.id}
                client={client}
                last={index === results.length - 1}
              />
            ))}
          </SettingsGroup>
        )}
      </View>
    </SettingsScroll>
  );
}
