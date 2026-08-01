import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Text, useTheme } from '@/shared/design-system';
import { SettingsGroup } from '@/features/settings/components/SettingsList';
import { SettingsScroll } from '@/features/settings/components/SettingsScroll';
import { useSettingsStore } from '@/features/settings';
import { InvoiceRow } from '../components/InvoiceRow';
import { InvoiceSearchField } from '../components/InvoiceSearchField';
import { groupInvoicesByDate } from '../format';
import { useInvoicesStore } from '../store';

export default function InvoiceSearchScreen() {
  const { space } = useTheme();
  const currency = useSettingsStore((s) => s.preferences.currency);
  const invoices = useInvoicesStore((s) => s.invoices);
  const [query, setQuery] = useState('');

  const q = query.trim();
  const sections = useMemo(() => {
    if (!q) return [];
    const needle = q.toLowerCase();
    const results = invoices.filter(
      (invoice) =>
        invoice.number.toLowerCase().includes(needle) ||
        invoice.customerName.toLowerCase().includes(needle),
    );
    return groupInvoicesByDate(results);
  }, [invoices, q]);

  return (
    <SettingsScroll includeTopInset>
      <InvoiceSearchField value={query} onChangeText={setQuery} />

      <View style={{ marginTop: space.lg }}>
        {!q ? (
          <Text variant="body" muted style={{ marginLeft: space.md }}>
            Search by invoice number or client
          </Text>
        ) : sections.length === 0 ? (
          <Text variant="body" muted style={{ marginLeft: space.md }}>
            No results for “{q}”
          </Text>
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
      </View>
    </SettingsScroll>
  );
}
