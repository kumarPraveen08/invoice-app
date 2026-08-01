import { useEffect, useMemo, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Button, Text, useTheme } from '@/shared/design-system';
import { BottomSheet } from './BottomSheet';

export type PickerOption = {
  id: string;
  title: string;
  subtitle?: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  options: PickerOption[];
  searchPlaceholder?: string;
  /** Single select: tap closes and returns one id. */
  multiple?: boolean;
  confirmLabel?: string;
  onSelect: (ids: string[]) => void;
};

export function SearchablePickerSheet({
  visible,
  onClose,
  title,
  options,
  searchPlaceholder = 'Search',
  multiple = false,
  confirmLabel = 'Add selected',
  onSelect,
}: Props) {
  const { colors, radii, space } = useTheme();
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<string[]>([]);

  useEffect(() => {
    if (!visible) return;
    setQuery('');
    setPicked([]);
  }, [visible]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (option) =>
        option.title.toLowerCase().includes(q) ||
        (option.subtitle?.toLowerCase().includes(q) ?? false),
    );
  }, [options, query]);

  const toggle = (id: string) => {
    if (!multiple) {
      onSelect([id]);
      onClose();
      return;
    }
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id],
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      <View
        style={[
          styles.search,
          {
            backgroundColor: colors.background,
            borderRadius: radii.lg,
            marginBottom: space.md,
            paddingHorizontal: space.md,
          },
        ]}
      >
        <Ionicons name="search" size={18} color={colors.onSurfaceMuted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={searchPlaceholder}
          placeholderTextColor={colors.onSurfaceMuted}
          autoCorrect={false}
          autoCapitalize="none"
          style={[styles.searchInput, { color: colors.onSurface }]}
        />
        {query.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            onPress={() => setQuery('')}
            hitSlop={8}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.onSurfaceMuted}
            />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        style={{ maxHeight: 360 }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {filtered.length === 0 ? (
          <Text variant="body" muted style={{ paddingVertical: space.lg }}>
            No matches.
          </Text>
        ) : (
          filtered.map((option) => {
            const selected = picked.includes(option.id);
            return (
              <Pressable
                key={option.id}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => toggle(option.id)}
                style={[
                  styles.row,
                  {
                    paddingVertical: space.md,
                    borderBottomColor: colors.background,
                  },
                ]}
              >
                {multiple ? (
                  <Ionicons
                    name={selected ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={selected ? colors.primary : colors.onSurfaceMuted}
                    style={{ marginRight: space.md }}
                  />
                ) : null}
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text
                    variant="body"
                    style={{ fontWeight: '600' }}
                    numberOfLines={1}
                  >
                    {option.title}
                  </Text>
                  {option.subtitle ? (
                    <Text variant="caption" muted numberOfLines={1}>
                      {option.subtitle}
                    </Text>
                  ) : null}
                </View>
                {!multiple ? (
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.onSurfaceMuted}
                  />
                ) : null}
              </Pressable>
            );
          })
        )}
      </ScrollView>

      {multiple ? (
        <Button
          label={
            picked.length === 0
              ? confirmLabel
              : `${confirmLabel} (${picked.length})`
          }
          disabled={picked.length === 0}
          onPress={() => {
            onSelect(picked);
            onClose();
          }}
          style={{
            marginTop: space.md,
            alignSelf: 'stretch',
            justifyContent: 'center',
            opacity: picked.length === 0 ? 0.45 : 1,
          }}
        />
      ) : null}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
