import { View } from 'react-native';
import { useTheme } from '@/shared/design-system';
import { FilterChipRow } from '@/shared/ui';
import { FILTERS } from '../constants';
import type { InvoiceFilter } from '../types';

type Props = {
  filter: InvoiceFilter;
  onFilterChange: (filter: InvoiceFilter) => void;
};

export function InvoiceFilters({ filter, onFilterChange }: Props) {
  const { space } = useTheme();

  return (
    <View style={{ marginBottom: space.lg }}>
      <FilterChipRow
        items={FILTERS}
        value={filter}
        onChange={onFilterChange}
      />
    </View>
  );
}
