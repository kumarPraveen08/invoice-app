import { format, subMonths } from 'date-fns';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Text, useTheme } from '@/shared/design-system';
import { BottomSheet, DateField, EmptyState, showSnackbar } from '@/shared/ui';
import { formatMoney } from '@/features/invoices/format';
import { useInvoicesStore } from '@/features/invoices';
import { useClientsStore } from '@/features/customers';
import { useSettingsStore } from '@/features/settings/store';
import { SettingsGroup } from '@/features/settings/components/SettingsList';
import { SettingsScroll } from '@/features/settings/components/SettingsScroll';
import {
  formatRangeLabel,
  invoicesInPeriod,
  monthlyCollected,
  parseDateInput,
  REPORT_PERIODS,
  summarizeInvoices,
  type DateRange,
  type MonthBar,
  type ReportPeriod,
} from '../compute';

function ChipRow<T extends string>({
  items,
  value,
  labelFor,
  onChange,
}: {
  items: { id: T; label: string }[];
  value: T;
  labelFor?: (id: T, fallback: string) => string;
  onChange: (id: T) => void;
}) {
  const { colors, radii, space } = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      nestedScrollEnabled
      style={styles.chipScroll}
      contentContainerStyle={[styles.chipContent, { gap: space.sm }]}
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
                borderColor: selected ? colors.iconSoft : colors.onSurfaceMuted,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text
              variant="label"
              style={{ color: selected ? colors.primary : colors.onSurface }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function SnapshotCard({
  received,
  unpaid,
  overdue,
  invoiceCount,
  currency,
}: {
  received: number;
  unpaid: number;
  overdue: number;
  invoiceCount: number;
  currency: string;
}) {
  const { colors, radii, space } = useTheme();
  const rows = [
    {
      label: 'Money received',
      hint: 'Paid by customers',
      value: formatMoney(received, currency),
      strong: true,
    },
    {
      label: 'Still unpaid',
      hint: 'Open balance left',
      value: formatMoney(unpaid, currency),
      strong: false,
    },
    {
      label: 'Overdue',
      hint: 'Past due date',
      value: formatMoney(overdue, currency),
      strong: false,
    },
    {
      label: 'Invoices',
      hint: 'Matching this filter',
      value: String(invoiceCount),
      strong: false,
    },
  ] as const;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radii.xl,
        overflow: 'hidden',
      }}
    >
      {rows.map((row, index) => (
        <View
          key={row.label}
          style={[
            styles.snapshotRow,
            {
              paddingHorizontal: space.lg,
              paddingVertical: space.md,
              borderBottomWidth:
                index === rows.length - 1 ? 0 : StyleSheet.hairlineWidth,
              borderBottomColor: colors.background,
            },
          ]}
        >
          <View style={styles.snapshotCopy}>
            <Text
              variant="body"
              style={{ fontWeight: row.strong ? '700' : '600' }}
            >
              {row.label}
            </Text>
            <Text variant="caption" muted>
              {row.hint}
            </Text>
          </View>
          <Text
            variant={row.strong ? 'subtitle' : 'body'}
            style={{ fontWeight: '700' }}
          >
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function MonthBars({
  bars,
  currency,
}: {
  bars: MonthBar[];
  currency: string;
}) {
  const { colors, radii, space } = useTheme();
  const max = Math.max(...bars.map((b) => b.collected), 1);

  return (
    <SettingsGroup title="Money received by month">
      {bars.map((bar, index) => {
        const widthPct =
          bar.collected > 0 ? Math.max(8, (bar.collected / max) * 100) : 0;
        return (
          <View
            key={bar.key}
            style={[
              styles.hBarRow,
              {
                paddingHorizontal: space.lg,
                paddingVertical: space.md,
                borderBottomWidth:
                  index === bars.length - 1 ? 0 : StyleSheet.hairlineWidth,
                borderBottomColor: colors.background,
              },
            ]}
          >
            <Text variant="label" style={styles.monthLabel}>
              {bar.label}
            </Text>
            <View style={styles.hBarTrack}>
              <View
                style={{
                  width: `${widthPct}%`,
                  height: 8,
                  borderRadius: radii.sm,
                  backgroundColor:
                    bar.collected > 0 ? colors.primary : colors.iconSoft,
                }}
              />
            </View>
            <Text variant="label" style={styles.hBarAmount}>
              {formatMoney(bar.collected, currency)}
            </Text>
          </View>
        );
      })}
    </SettingsGroup>
  );
}

function MetricRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  const { colors, space } = useTheme();
  return (
    <View
      style={[
        styles.metricRow,
        {
          paddingHorizontal: space.lg,
          paddingVertical: space.md,
          borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
          borderBottomColor: colors.background,
        },
      ]}
    >
      <Text variant="body" muted>
        {label}
      </Text>
      <Text variant="body" style={{ fontWeight: '600' }}>
        {value}
      </Text>
    </View>
  );
}

function defaultCustomRange(): DateRange {
  const end = new Date();
  const start = subMonths(end, 1);
  return {
    start: format(start, 'yyyy-MM-dd'),
    end: format(end, 'yyyy-MM-dd'),
  };
}

export default function ReportsScreen() {
  const { colors, space } = useTheme();
  const currency = useSettingsStore((s) => s.preferences.currency);
  const invoices = useInvoicesStore((s) => s.invoices);
  const clients = useClientsStore((s) => s.clients);
  const [period, setPeriod] = useState<ReportPeriod>('month');
  const [customRange, setCustomRange] = useState<DateRange>(defaultCustomRange);
  const [draftRange, setDraftRange] = useState<DateRange>(defaultCustomRange);
  const [rangeOpen, setRangeOpen] = useState(false);

  const summary = useMemo(() => {
    return summarizeInvoices(
      invoicesInPeriod(invoices, period, customRange),
    );
  }, [invoices, period, customRange]);

  const monthBars = useMemo(() => monthlyCollected(invoices, 6), [invoices]);

  const openClient = (customerName: string) => {
    const match = clients.find(
      (client) =>
        client.businessName === customerName || client.name === customerName,
    );
    if (!match) return;
    router.push(`/clients/${match.id}`);
  };

  const openCustomRange = () => {
    setDraftRange(customRange);
    setRangeOpen(true);
  };

  const onPeriodChange = (next: ReportPeriod) => {
    if (next === 'custom') {
      setPeriod('custom');
      openCustomRange();
      return;
    }
    setPeriod(next);
  };

  const applyCustomRange = () => {
    const start = parseDateInput(draftRange.start);
    const end = parseDateInput(draftRange.end);
    if (!start || !end) {
      showSnackbar('Pick valid start and end dates.');
      return;
    }
    if (start > end) {
      showSnackbar('Start date must be before end date.');
      return;
    }
    setCustomRange({
      start: draftRange.start.trim(),
      end: draftRange.end.trim(),
    });
    setPeriod('custom');
    setRangeOpen(false);
  };

  if (invoices.length === 0) {
    return (
      <SettingsScroll withTabBar>
        <EmptyState
          title="Nothing to report"
          description="Create invoices to see what customers paid and what they still owe."
        />
      </SettingsScroll>
    );
  }

  return (
    <SettingsScroll withTabBar>
      <View style={{ marginBottom: space.xl }}>
        <ChipRow
          items={REPORT_PERIODS}
          value={period}
          labelFor={(id, fallback) =>
            id === 'custom' && period === 'custom'
              ? formatRangeLabel(customRange)
              : fallback
          }
          onChange={onPeriodChange}
        />
      </View>

      <View style={{ marginBottom: space['2xl'] }}>
        <SnapshotCard
          received={summary.collected}
          unpaid={summary.outstanding}
          overdue={summary.overdue}
          invoiceCount={summary.invoiceCount}
          currency={currency}
        />
      </View>

      <MonthBars bars={monthBars} currency={currency} />

      {summary.byStatus.length > 0 ? (
        <SettingsGroup title="Invoice count by status">
          {summary.byStatus.map((row, index) => (
            <MetricRow
              key={row.status}
              label={row.label}
              value={String(row.count)}
              last={index === summary.byStatus.length - 1}
            />
          ))}
        </SettingsGroup>
      ) : null}

      {summary.topClients.length > 0 ? (
        <SettingsGroup title="Top clients by billed">
          {summary.topClients.map((client, index) => (
            <Pressable
              key={client.name}
              accessibilityRole="button"
              accessibilityLabel={`Open ${client.name}`}
              onPress={() => openClient(client.name)}
              style={[
                styles.clientRow,
                {
                  paddingHorizontal: space.lg,
                  paddingVertical: space.md,
                  borderBottomWidth:
                    index === summary.topClients.length - 1
                      ? 0
                      : StyleSheet.hairlineWidth,
                  borderBottomColor: colors.background,
                },
              ]}
            >
              <View style={styles.clientCopy}>
                <Text
                  variant="body"
                  style={{ fontWeight: '600' }}
                  numberOfLines={1}
                >
                  {client.name}
                </Text>
                {client.outstanding > 0 ? (
                  <Text variant="caption" muted>
                    Still owes {formatMoney(client.outstanding, currency)}
                  </Text>
                ) : (
                  <Text variant="caption" muted>
                    Fully paid
                  </Text>
                )}
              </View>
              <Text variant="body" style={{ fontWeight: '600' }}>
                {formatMoney(client.billed, currency)}
              </Text>
            </Pressable>
          ))}
        </SettingsGroup>
      ) : null}

      <BottomSheet
        visible={rangeOpen}
        onClose={() => setRangeOpen(false)}
        title="Custom date range"
      >
        <View style={{ gap: space.md, marginBottom: space.lg }}>
          <DateField
            label="From"
            value={draftRange.start}
            onChange={(start) => setDraftRange((r) => ({ ...r, start }))}
          />
          <DateField
            label="To"
            value={draftRange.end}
            onChange={(end) => setDraftRange((r) => ({ ...r, end }))}
          />
        </View>
        <Button
          label="Apply range"
          onPress={applyCustomRange}
          style={{ alignSelf: 'stretch', justifyContent: 'center' }}
        />
      </BottomSheet>
    </SettingsScroll>
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
  snapshotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  snapshotCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  hBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  monthLabel: {
    width: 36,
  },
  hBarTrack: {
    flex: 1,
    height: 8,
    justifyContent: 'center',
  },
  hBarAmount: {
    minWidth: 88,
    textAlign: 'right',
    fontWeight: '600',
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clientCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
});
