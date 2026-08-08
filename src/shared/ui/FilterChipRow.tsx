import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { Text, useTheme } from '@/shared/design-system';

type FontIcon = ComponentProps<typeof MaterialIcons>['name'];

export type FilterChipItem<T extends string> = {
  id: T;
  label: string;
  fontIcon?: FontIcon;
  /** @deprecated Prefer fontIcon — kept for existing data. */
  icon?: number;
};

type Props<T extends string> = {
  items: FilterChipItem<T>[];
  value: T;
  onChange: (id: T) => void;
  labelFor?: (id: T, fallback: string) => string;
};

/**
 * Horizontal single-select filter chips (RN Pressable).
 * Compose FilterChip was dropped — Host bridge made selection feel laggy.
 */
export function FilterChipRow<T extends string>({
  items,
  value,
  onChange,
  labelFor,
}: Props<T>) {
  const { colors, radii, space } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      nestedScrollEnabled
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, { gap: space.sm }]}
    >
      {items.map((item) => {
        const selected = item.id === value;
        const label = labelFor?.(item.id, item.label) ?? item.label;
        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(item.id)}
            style={({ pressed }) => [
              styles.chip,
              {
                paddingHorizontal: space.lg,
                borderRadius: radii.full,
                backgroundColor: selected ? colors.iconSoft : colors.surface,
                opacity: pressed ? 0.85 : 1,
                gap: 6,
              },
            ]}
          >
            {item.fontIcon ? (
              <MaterialIcons
                name={item.fontIcon}
                size={18}
                color={selected ? colors.primary : colors.onSurface}
              />
            ) : null}
            <Text
              variant="label"
              style={{
                color: selected ? colors.primary : colors.onSurface,
                fontWeight: '600',
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    alignItems: 'center',
    paddingRight: 4,
  },
  chip: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
