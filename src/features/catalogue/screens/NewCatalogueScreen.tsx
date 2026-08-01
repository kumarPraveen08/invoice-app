import { useEffect, useState } from 'react';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { Button, useTheme } from '@/shared/design-system';
import { createId } from '@/shared/lib/id';
import { SettingsField } from '@/features/settings/components/SettingsField';
import { SettingsScroll } from '@/features/settings/components/SettingsScroll';
import { useCatalogueStore } from '../store';

type FieldErrors = {
  name?: string;
  sku?: string;
  price?: string;
};

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
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    navigation.setOptions({
      title: editing ? 'Edit item' : 'New catalogue item',
    });
  }, [editing, navigation]);

  const clearError = (key: keyof FieldErrors) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const onSave = () => {
    const trimmedName = name.trim();
    const trimmedSku = sku.trim();
    const next: FieldErrors = {};
    if (!trimmedName) next.name = 'Enter an item name.';
    if (!trimmedSku) next.sku = 'Enter a code or SKU.';
    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      next.price = 'Enter a valid selling price.';
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setErrors({});
    upsertItem({
      id: existing?.id ?? createId('item'),
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
        onChangeText={(value) => {
          setName(value);
          clearError('name');
        }}
        placeholder="Brand identity package"
        autoCapitalize="sentences"
        error={errors.name}
      />
      <SettingsField
        label="SKU"
        value={sku}
        onChangeText={(value) => {
          setSku(value);
          clearError('sku');
        }}
        placeholder="SRV-101"
        autoCapitalize="characters"
        autoCorrect={false}
        error={errors.sku}
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
        onChangeText={(value) => {
          setPrice(value);
          clearError('price');
        }}
        placeholder="45000"
        keyboardType="decimal-pad"
        error={errors.price}
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
