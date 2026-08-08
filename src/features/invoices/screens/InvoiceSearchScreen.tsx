import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Text, useTheme } from '@/shared/design-system';
import { SearchField } from '@/shared/ui';
import { SettingsSectionList } from '@/features/settings/components/SettingsScroll';
import { useSettingsStore } from '@/features/settings/store';
import { InvoiceRow } from '../components/InvoiceRow';
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
    <SettingsSectionList
      includeTopInset
      sections={sections}
      keyExtractor={(invoice) => invoice.id}
      ListHeaderComponent={
        <View style={{ marginBottom: space.lg }}>
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder="Search invoices"
          />
          {!q ? (
            <Text
              variant="body"
              muted
              style={{ marginLeft: space.md, marginTop: space.lg }}
            >
              Search by invoice number or client
            </Text>
          ) : null}
        </View>
      }
      ListEmptyComponent={
        q ? (
          <Text variant="body" muted style={{ marginLeft: space.md }}>
            No results for “{q}”
          </Text>
        ) : null
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
