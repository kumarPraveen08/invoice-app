import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { v4 as uuid } from 'uuid';
import { Button, useTheme } from '@/shared/design-system';
import { SettingsField } from '@/features/settings/components/SettingsField';
import { SettingsScroll } from '@/features/settings/components/SettingsScroll';
import { useCatalogueStore } from '../store';

export default function NewCatalogueScreen() {
  const { space } = useTheme();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = useCatalogueStore((s) =>
    id ? s.items.find((row) => row.id === id) : undefined,
  );
  const upsertItem = useCatalogueStore((s) => s.upsertItem);
  const editing = Boolean(id);

  const [name, setName] = useState(existing?.name ?? '');
  const [sku, setSku] = useState(existing?.sku ?? '');
  const [category, setCategory] = useState(existing?.category ?? '');
  const [price, setPrice] = useState(
    existing ? String(existing.price) : '',
  );
  const [unit, setUnit] = useState(existing?.unit ?? '');

  useEffect(() => {
    navigation.setOptions({
      title: editing ? 'Edit item' : 'New catalogue item',
    });
  }, [editing, navigation]);

  const onSave = () => {
    const trimmedName = name.trim();
    const trimmedSku = sku.trim();
    if (!trimmedName) {
      Alert.alert('Name required', 'Enter an item name.');
      return;
    }
    if (!trimmedSku) {
      Alert.alert('SKU required', 'Enter a code or SKU.');
      return;
    }
    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      Alert.alert('Invalid price', 'Enter a valid selling price.');
      return;
    }

    upsertItem({
      id: existing?.id ?? uuid(),
      name: trimmedName,
      sku: trimmedSku,
      category: category.trim() || 'General',
      price: parsedPrice,
      unit: unit.trim() || 'unit',
    });
    router.back();
  };

  return (
    <SettingsScroll>
      <SettingsField
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Brand identity package"
        autoCapitalize="sentences"
      />
      <SettingsField
        label="SKU"
        value={sku}
        onChangeText={setSku}
        placeholder="SRV-101"
        autoCapitalize="characters"
        autoCorrect={false}
      />
      <SettingsField
        label="Category"
        value={category}
        onChangeText={setCategory}
        placeholder="Services"
        autoCapitalize="words"
      />
      <SettingsField
        label="Selling price"
        value={price}
        onChangeText={setPrice}
        placeholder="45000"
        keyboardType="decimal-pad"
      />
      <SettingsField
        label="Unit"
        value={unit}
        onChangeText={setUnit}
        placeholder="project"
        autoCapitalize="none"
      />
      <Button
        label={editing ? 'Save changes' : 'Add item'}
        onPress={onSave}
        style={{
          marginTop: space.sm,
          alignSelf: 'stretch',
          justifyContent: 'center',
        }}
      />
    </SettingsScroll>
  );
}
