import { useDeferredValue, useMemo, useState } from 'react';
import { router } from 'expo-router';
import { EmptyState } from '@/shared/ui';
import { SettingsSectionList } from '@/features/settings/components/SettingsScroll';
import { useSettingsStore } from '@/features/settings/store';
import { InvoiceFilters } from '../components/InvoiceFilters';
import { InvoiceRow } from '../components/InvoiceRow';
import { matchesFilter } from '../constants';
import { groupInvoicesByDate } from '../format';
import { useInvoicesStore } from '../store';
import type { InvoiceFilter } from '../types';

export default function InvoicesScreen() {
  const currency = useSettingsStore((s) => s.preferences.currency);
  const invoices = useInvoicesStore((s) => s.invoices);
  const [filter, setFilter] = useState<InvoiceFilter>('all');
  const deferredFilter = useDeferredValue(filter);

  const sections = useMemo(() => {
    const filtered = invoices.filter((invoice) =>
      matchesFilter(invoice, deferredFilter),
    );
    return groupInvoicesByDate(filtered);
  }, [invoices, deferredFilter]);

  return (
    <SettingsSectionList
      withTabBar
      sections={sections}
      keyExtractor={(invoice) => invoice.id}
      ListHeaderComponent={
        <InvoiceFilters filter={filter} onFilterChange={setFilter} />
      }
      ListEmptyComponent={
        <EmptyState
          title="No invoices"
          description={
            filter !== 'all'
              ? 'Nothing matches this filter.'
              : 'Use + to create your first invoice.'
          }
        />
      }
      renderItem={(invoice, index, section) => (
        <InvoiceRow
          invoice={invoice}
          currency={currency}
          last={index === section.data.length - 1}
          onPress={() => router.push(`/invoice/${invoice.id}`)}
        />
      )}
    />
  );
}
