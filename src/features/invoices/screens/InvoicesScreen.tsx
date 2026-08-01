import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Text, useTheme } from '@/shared/design-system';
import { SettingsGroup } from '@/features/settings/components/SettingsList';
import { SettingsScroll } from '@/features/settings/components/SettingsScroll';
import { useSettingsStore } from '@/features/settings';
import { InvoiceFilters } from '../components/InvoiceFilters';
import { InvoiceRow } from '../components/InvoiceRow';
import { matchesFilter } from '../constants';
import { groupInvoicesByDate } from '../format';
import { useInvoicesStore } from '../store';
import type { InvoiceFilter } from '../types';

export default function InvoicesScreen() {
  const { space } = useTheme();
  const currency = useSettingsStore((s) => s.preferences.currency);
  const invoices = useInvoicesStore((s) => s.invoices);
  const [filter, setFilter] = useState<InvoiceFilter>('all');

  const sections = useMemo(() => {
    const filtered = invoices.filter((invoice) =>
      matchesFilter(invoice, filter),
    );
    return groupInvoicesByDate(filtered);
  }, [invoices, filter]);

  return (
    <SettingsScroll withTabBar>
      <InvoiceFilters value={filter} onChange={setFilter} />

      {sections.length === 0 ? (
        <View style={{ paddingTop: space['3xl'], alignItems: 'center' }}>
          <Text variant="subtitle" style={{ marginBottom: space.sm }}>
            No invoices
          </Text>
          <Text variant="body" muted style={{ textAlign: 'center' }}>
            {filter !== 'all'
              ? 'Nothing matches this filter.'
              : 'Use + to create your first invoice.'}
          </Text>
        </View>
      ) : (
        sections.map((section) => (
          <SettingsGroup key={section.title} title={section.title}>
            {section.data.map((invoice, index) => (
              <InvoiceRow
                key={invoice.id}
                invoice={invoice}
                currency={currency}
                last={index === section.data.length - 1}
              />
            ))}
          </SettingsGroup>
        ))
      )}
    </SettingsScroll>
  );
}
