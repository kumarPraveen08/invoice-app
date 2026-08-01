import { useEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Screen, Text, useTheme } from '@/shared/design-system';
import { useCatalogueStore } from '../store';

export default function NewCatalogueScreen() {
  const { space } = useTheme();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const item = useCatalogueStore((s) =>
    id ? s.items.find((row) => row.id === id) : undefined,
  );
  const editing = Boolean(id);

  useEffect(() => {
    navigation.setOptions({
      title: editing ? 'Edit item' : 'New catalogue item',
    });
  }, [editing, navigation]);

  return (
    <Screen style={{ padding: space.lg }}>
      <Text variant="body" muted>
        {editing
          ? `Editing ${item?.name ?? 'item'}. Form fields come next.`
          : 'Catalogue item form will go here.'}
      </Text>
    </Screen>
  );
}
