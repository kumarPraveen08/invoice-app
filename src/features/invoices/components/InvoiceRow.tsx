import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Share, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Text, useTheme } from '@/shared/design-system';
import { shareTextFile } from '@/shared/lib/files';
import { ActionSheet, showSnackbar, type SheetAction } from '@/shared/ui';
import { STATUS_LABEL, outstandingOf } from '../constants';
import { formatInvoiceDate, formatMoney, invoiceSummaryText } from '../format';
import { useInvoicesStore } from '../store';
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

function unpaidStatusFor(invoice: Invoice): InvoiceStatus {
  const today = new Date().toISOString().slice(0, 10);
  return invoice.dueDate < today ? 'overdue' : 'sent';
}

export function InvoiceRow({ invoice, currency, last = false, onPress }: Props) {
  const { colors, radii, space } = useTheme();
  const patchInvoice = useInvoicesStore((s) => s.patchInvoice);
  const [actionsOpen, setActionsOpen] = useState(false);
  const outstanding = outstandingOf(invoice);
  const isOverdue = invoice.status === 'overdue';
  const showBalance =
    invoice.status !== 'paid' &&
    invoice.status !== 'draft' &&
    invoice.status !== 'cancelled' &&
    invoice.status !== 'void';
  const canTogglePaid =
    invoice.status !== 'cancelled' && invoice.status !== 'void';

  const onOpen = () => {
    if (onPress) onPress();
    else router.push(`/invoice/${invoice.id}`);
  };

  const onEdit = () => {
    router.push({ pathname: '/invoice/new', params: { id: invoice.id } });
  };

  const onShare = async () => {
    try {
      await Share.share({
        title: invoice.number,
        message: invoiceSummaryText(invoice, currency),
      });
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : 'Could not share invoice.',
      );
    }
  };

  const onDownload = async () => {
    try {
      await shareTextFile(
        `${invoice.number}.txt`,
        invoiceSummaryText(invoice, currency),
        'text/plain',
      );
    } catch (error) {
      showSnackbar(
        error instanceof Error ? error.message : 'Could not download invoice.',
      );
    }
  };

  const onTogglePaid = () => {
    if (invoice.status === 'paid') {
      patchInvoice(invoice.id, {
        status: unpaidStatusFor(invoice),
        paid: 0,
      });
      return;
    }
    patchInvoice(invoice.id, {
      status: 'paid',
      paid: invoice.total,
    });
  };

  const actions: SheetAction[] = [
    {
      key: 'view',
      label: 'View',
      icon: 'eye-outline',
      onPress: onOpen,
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: 'create-outline',
      onPress: onEdit,
    },
    {
      key: 'share',
      label: 'Share',
      icon: 'share-outline',
      onPress: () => {
        void onShare();
      },
    },
    {
      key: 'download',
      label: 'Download',
      icon: 'download-outline',
      onPress: () => {
        void onDownload();
      },
    },
  ];

  if (canTogglePaid) {
    actions.push({
      key: 'paid',
      label: invoice.status === 'paid' ? 'Mark as unpaid' : 'Mark as paid',
      icon:
        invoice.status === 'paid'
          ? 'close-circle-outline'
          : 'checkmark-circle-outline',
      onPress: onTogglePaid,
    });
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={onOpen}
        onLongPress={() => setActionsOpen(true)}
        delayLongPress={280}
        style={[
          styles.row,
          {
            paddingHorizontal: space.lg,
            paddingVertical: space.md,
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

      <ActionSheet
        visible={actionsOpen}
        onClose={() => setActionsOpen(false)}
        title={invoice.number}
        actions={actions}
      />
    </>
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
