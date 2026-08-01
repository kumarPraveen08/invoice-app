import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text, useTheme } from '@/shared/design-system';
import { SettingsGroup, SettingsRow } from '@/features/settings/components/SettingsList';
import { SettingsScroll } from '@/features/settings/components/SettingsScroll';
import { useSettingsStore } from '@/features/settings';
import { STATUS_LABEL, outstandingOf } from '../constants';
import { formatInvoiceDate, formatMoney } from '../format';
import { useInvoicesStore } from '../store';

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { space } = useTheme();
  const currency = useSettingsStore((s) => s.preferences.currency);
  const invoice = useInvoicesStore((s) =>
    s.invoices.find((item) => item.id === id),
  );

  if (!invoice) {
    return (
      <SettingsScroll>
        <Text variant="body" muted>
          Invoice not found.
        </Text>
      </SettingsScroll>
    );
  }

  const balance = outstandingOf(invoice);

  return (
    <SettingsScroll>
      <Text variant="title" style={{ marginBottom: space.xs }}>
        {invoice.customerName}
      </Text>
      <Text variant="body" muted style={{ marginBottom: space['2xl'] }}>
        {invoice.number} · {STATUS_LABEL[invoice.status]}
      </Text>

      <SettingsGroup title="Summary">
        <SettingsRow
          icon="cash-outline"
          title="Total"
          subtitle={formatMoney(invoice.total, currency)}
          showChevron={false}
        />
        <SettingsRow
          icon="wallet-outline"
          title="Paid"
          subtitle={formatMoney(invoice.paid, currency)}
          showChevron={false}
        />
        <SettingsRow
          icon="time-outline"
          title="Outstanding"
          subtitle={formatMoney(balance, currency)}
          showChevron={false}
          last
        />
      </SettingsGroup>

      <SettingsGroup title="Dates">
        <SettingsRow
          icon="calendar-outline"
          title="Issued"
          subtitle={formatInvoiceDate(invoice.issueDate)}
          showChevron={false}
        />
        <SettingsRow
          icon="flag-outline"
          title="Due"
          subtitle={formatInvoiceDate(invoice.dueDate)}
          showChevron={false}
          last
        />
      </SettingsGroup>

      <View style={{ marginTop: space.sm }}>
        <Text variant="caption" muted>
          Edit, share, payments, and reminders will live here.
        </Text>
      </View>
    </SettingsScroll>
  );
}
