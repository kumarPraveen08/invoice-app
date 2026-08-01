import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@/shared/design-system';
import { STATUS_LABEL, outstandingOf } from '../constants';
import { formatInvoiceDate, formatMoney } from '../format';
import type { Invoice, InvoiceStatus } from '../types';

type Props = {
  invoice: Invoice;
  currency: string;
  last?: boolean;
  onPress?: () => void;
};

const STATUS_ICON: Record<InvoiceStatus, keyof typeof Ionicons.glyphMap> = {
  draft: 'document-outline',
  sent: 'send-outline',
  opened: 'mail-open-outline',
  partial: 'pie-chart-outline',
  paid: 'checkmark-circle-outline',
  overdue: 'alert-circle-outline',
  cancelled: 'close-circle-outline',
  void: 'ban-outline',
};

export function InvoiceRow({ invoice, currency, last = false, onPress }: Props) {
  const { colors, radii, space } = useTheme();
  const outstanding = outstandingOf(invoice);
  const isOverdue = invoice.status === 'overdue';
  const showBalance =
    invoice.status !== 'paid' &&
    invoice.status !== 'draft' &&
    invoice.status !== 'cancelled' &&
    invoice.status !== 'void';

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        {
          paddingHorizontal: space.lg,
          paddingVertical: space.md,
          opacity: pressed && onPress ? 0.72 : 1,
          borderBottomWidth: last ? 0 : StyleSheet.hairlineWidth,
          borderBottomColor: colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
          {
            backgroundColor: colors.iconSoft,
            borderRadius: radii.full,
            marginRight: space.md,
          },
        ]}
      >
        <Ionicons
          name={STATUS_ICON[invoice.status]}
          size={20}
          color={colors.primary}
        />
      </View>
      <View style={styles.copy}>
        <Text variant="body" style={{ fontWeight: '600' }} numberOfLines={1}>
          {invoice.customerName}
        </Text>
        <Text variant="caption" muted numberOfLines={1}>
          {invoice.number}
          {' · '}
          {formatInvoiceDate(invoice.issueDate)}
        </Text>
      </View>
      <View style={styles.meta}>
        <Text variant="body" style={{ fontWeight: '600' }}>
          {formatMoney(invoice.total, currency)}
        </Text>
        <Text
          variant="caption"
          style={{
            color: isOverdue ? colors.primary : colors.onSurfaceMuted,
            textAlign: 'right',
          }}
          numberOfLines={1}
        >
          {STATUS_LABEL[invoice.status]}
          {showBalance && outstanding > 0 && outstanding < invoice.total
            ? ` · ${formatMoney(outstanding, currency)} due`
            : null}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
    marginRight: 8,
  },
  meta: {
    alignItems: 'flex-end',
    gap: 2,
  },
});
