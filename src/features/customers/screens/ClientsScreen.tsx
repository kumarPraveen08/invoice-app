import { useMemo } from 'react';
import { EmptyState } from '@/shared/ui';
import { SettingsSectionList } from '@/features/settings/components/SettingsScroll';
import { ClientRow } from '../components/ClientRow';
import { useClientsStore } from '../store';
import type { Client } from '../types';

function groupByInitial(clients: Client[]) {
  const sorted = [...clients].sort((a, b) => a.name.localeCompare(b.name));
  const map = new Map<string, Client[]>();
  for (const client of sorted) {
    const key = client.name.charAt(0).toUpperCase();
    const list = map.get(key) ?? [];
    list.push(client);
    map.set(key, list);
  }
  return [...map.entries()].map(([title, data]) => ({ title, data }));
}

export default function ClientsScreen() {
  const clients = useClientsStore((s) => s.clients);
  const sections = useMemo(() => groupByInitial(clients), [clients]);

  return (
    <SettingsSectionList
      withTabBar
      sections={sections}
      keyExtractor={(client) => client.id}
      ListEmptyComponent={
        <EmptyState
          title="No clients yet"
          description="Use + to add your first client."
        />
      }
      renderItem={(client, index, section) => (
        <ClientRow
          client={client}
          last={index === section.data.length - 1}
        />
      )}
    />
  );
}
