import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@/shared/design-system';
import { FILTERS } from '../constants';
import type { InvoiceFilter } from '../types';

type Props = {
  value: InvoiceFilter;
  onChange: (filter: InvoiceFilter) => void;
};

/** M3 filter chips — fixed height so selection doesn’t jump layout. */
export function InvoiceFilters({ value, onChange }: Props) {
  const { colors, radii, space } = useTheme();

  return (
    <View style={{ marginBottom: space.lg }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{
          gap: space.sm,
          alignItems: 'center',
        }}
      >
        {FILTERS.map((filter) => {
          const selected = filter.id === value;
          return (
            <Pressable
              key={filter.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onChange(filter.id)}
              style={({ pressed }) => [
                styles.chip,
                {
                  paddingHorizontal: space.lg,
                  borderRadius: radii.full,
                  backgroundColor: selected ? colors.iconSoft : colors.surface,
                  borderColor: selected ? colors.iconSoft : colors.onSurfaceMuted,
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
                {filter.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
