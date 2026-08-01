import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@/shared/design-system';
import { FILTERS } from '../constants';
import type { InvoiceFilter } from '../types';

type Props = {
  filter: InvoiceFilter;
  onFilterChange: (filter: InvoiceFilter) => void;
};

export function InvoiceFilters({ filter, onFilterChange }: Props) {
  const { colors, radii, space } = useTheme();

  return (
    <View style={{ marginBottom: space.lg }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        style={styles.chipScroll}
        contentContainerStyle={[styles.chipContent, { gap: space.sm }]}
      >
        {FILTERS.map((item) => {
          const selected = item.id === filter;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onFilterChange(item.id)}
              style={({ pressed }) => [
                styles.chip,
                {
                  paddingHorizontal: space.lg,
                  borderRadius: radii.full,
                  backgroundColor: selected ? colors.iconSoft : colors.surface,
                  borderColor: selected
                    ? colors.iconSoft
                    : colors.onSurfaceMuted,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text
                variant="label"
                style={{
                  color: selected ? colors.primary : colors.onSurface,
                  fontWeight: '600',
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chipScroll: {
    height: 40,
  },
  chipContent: {
    alignItems: 'center',
    paddingRight: 4,
  },
  chip: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
