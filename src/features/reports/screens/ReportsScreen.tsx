import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@/shared/design-system';
import { EmptyState } from '@/shared/ui';
import { formatMoney } from '@/features/invoices/format';
import { useInvoicesStore } from '@/features/invoices';
import { useSettingsStore } from '@/features/settings';
import {
  SettingsGroup,
} from '@/features/settings/components/SettingsList';
import { SettingsScroll } from '@/features/settings/components/SettingsScroll';
import {
  invoicesInPeriod,
  REPORT_PERIODS,
  summarizeInvoices,
  type ReportPeriod,
} from '../compute';

function MetricRow({
  label,
  value,
  last = false,
  emphasis = false,
}: {
  label: string;
  value: string;
  last?: boolean;
  emphasis?: boolean;
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
      <Text variant="body" muted={!emphasis} style={emphasis ? { fontWeight: '600' } : undefined}>
        {label}
      </Text>
      <Text variant="body" style={{ fontWeight: '600' }}>
        {value}
      </Text>
    </View>
  );
}

export default function ReportsScreen() {
  const { colors, radii, space } = useTheme();
  const currency = useSettingsStore((s) => s.preferences.currency);
  const invoices = useInvoicesStore((s) => s.invoices);
  const [period, setPeriod] = useState<ReportPeriod>('month');

  const summary = useMemo(() => {
    return summarizeInvoices(invoicesInPeriod(invoices, period));
  }, [invoices, period]);

  if (invoices.length === 0) {
    return (
      <SettingsScroll withTabBar>
        <EmptyState
          title="Nothing to report"
          description="Create invoices to see collections and balances here."
        />
      </SettingsScroll>
    );
  }

  return (
    <SettingsScroll withTabBar>
      <View style={[styles.periods, { marginBottom: space.xl, gap: space.sm }]}>
        {REPORT_PERIODS.map((item) => {
          const selected = item.id === period;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => setPeriod(item.id)}
              style={({ pressed }) => [
                styles.periodChip,
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
                }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginBottom: space['2xl'], paddingHorizontal: space.sm }}>
        <Text variant="caption" muted style={styles.heroLabel}>
          Collected
        </Text>
        <Text
          style={{
            fontSize: 34,
            lineHeight: 40,
            fontWeight: '700',
            letterSpacing: -0.8,
            color: colors.onSurface,
            marginTop: 4,
          }}
        >
          {formatMoney(summary.collected, currency)}
        </Text>
        <Text variant="caption" muted style={{ marginTop: space.sm }}>
          {summary.invoiceCount === 0
            ? 'No invoices in this period'
            : `${formatMoney(summary.billed, currency)} billed · ${summary.invoiceCount} invoice${summary.invoiceCount === 1 ? '' : 's'}`}
        </Text>
      </View>

      <SettingsGroup title="Balances">
        <MetricRow
          label="Outstanding"
          value={formatMoney(summary.outstanding, currency)}
          emphasis
        />
        <MetricRow
          label="Overdue"
          value={formatMoney(summary.overdue, currency)}
          last
        />
      </SettingsGroup>

      {summary.byStatus.length > 0 ? (
        <SettingsGroup title="By status">
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
        <SettingsGroup title="Top clients">
          {summary.topClients.map((client, index) => (
            <View
              key={client.name}
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
                <Text variant="body" style={{ fontWeight: '600' }} numberOfLines={1}>
                  {client.name}
                </Text>
                {client.outstanding > 0 ? (
                  <Text variant="caption" muted>
                    {formatMoney(client.outstanding, currency)} due
                  </Text>
                ) : (
                  <Text variant="caption" muted>
                    Settled
                  </Text>
                )}
              </View>
              <Text variant="body" style={{ fontWeight: '600' }}>
                {formatMoney(client.billed, currency)}
              </Text>
            </View>
          ))}
        </SettingsGroup>
      ) : null}
    </SettingsScroll>
  );
}

const styles = StyleSheet.create({
  periods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  periodChip: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  heroLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.6,
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
