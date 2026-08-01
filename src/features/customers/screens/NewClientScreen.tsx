import { useEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Screen, Text, useTheme } from '@/shared/design-system';
import { useClientsStore } from '../store';

export default function NewClientScreen() {
  const { space } = useTheme();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const client = useClientsStore((s) =>
    id ? s.clients.find((row) => row.id === id) : undefined,
  );
  const editing = Boolean(id);

  useEffect(() => {
    navigation.setOptions({
      title: editing ? 'Edit client' : 'New client',
    });
  }, [editing, navigation]);

  return (
    <Screen style={{ padding: space.lg }}>
      <Text variant="body" muted>
        {editing
          ? `Editing ${client?.name ?? 'client'}. Form fields come next.`
          : 'Client form will go here.'}
      </Text>
    </Screen>
  );
}
