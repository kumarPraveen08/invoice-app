import { useState } from 'react';
import { Pressable, Share, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Icon, Text, useTheme, type IconName } from '@/shared/design-system';
import { TemplatePickerSheet } from '@/features/settings';
import { ActionSheet, showSnackbar, type SheetAction } from '@/shared/ui';
import { STATUS_LABEL, outstandingOf } from '../constants';
import { formatInvoiceDate, formatMoney } from '../format';
import { downloadInvoicePdf } from '../invoicePdf';
import { buildInvoiceShareMessage } from '../shareMessage';
import { useInvoicesStore } from '../store';
import type { Invoice, InvoiceStatus } from '../types';

type Props = {
  invoice: Invoice;
  currency: string;
  last?: boolean;
  onPress?: () => void;
};

const STATUS_ICON: Record<InvoiceStatus, IconName> = {
  draft: 'description',
  sent: 'send',
  opened: 'drafts',
  partial: 'pie-chart',
  paid: 'check-circle-outline',
  overdue: 'error-outline',
  cancelled: 'cancel',
  void: 'block',
};

function unpaidStatusFor(invoice: Invoice): InvoiceStatus {
  const today = new Date().toISOString().slice(0, 10);
  return invoice.dueDate < today ? 'overdue' : 'sent';
}

export function InvoiceRow({ invoice, currency, last = false, onPress }: Props) {
  const { colors, radii, space } = useTheme();
  const patchInvoice = useInvoicesStore((s) => s.patchInvoice);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<'share' | 'download'>('share');
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

  const onPickTemplate = async (templateId: string) => {
    try {
      if (pickerMode === 'share') {
        const message = buildInvoiceShareMessage(invoice, currency, templateId);
        await Share.share({ title: invoice.number, message });
        return;
      }
      await downloadInvoicePdf(invoice, currency, templateId);
      showSnackbar('PDF ready to save or share');
    } catch (error) {
      showSnackbar(
        error instanceof Error
          ? error.message
          : pickerMode === 'share'
            ? 'Could not share invoice.'
            : 'Could not download PDF.',
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
      icon: 'visibility',
      onPress: onOpen,
    },
    {
      key: 'edit',
      label: 'Edit',
      icon: 'edit',
      onPress: onEdit,
    },
    {
      key: 'share',
      label: 'Share',
      icon: 'share',
      onPress: () => {
        setPickerMode('share');
        setPickerOpen(true);
      },
    },
    {
      key: 'download',
      label: 'Download PDF',
      icon: 'download',
      onPress: () => {
        setPickerMode('download');
        setPickerOpen(true);
      },
    },
  ];

  if (canTogglePaid) {
    actions.push({
      key: 'paid',
      label: invoice.status === 'paid' ? 'Mark as unpaid' : 'Mark as paid',
      icon: invoice.status === 'paid' ? 'cancel' : 'check-circle-outline',
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
          <Icon
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
        subtitle={`${invoice.customerName} · ${formatInvoiceDate(invoice.issueDate)} · ${formatMoney(invoice.total, currency)}`}
        actions={actions}
      />
      <TemplatePickerSheet
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title={
          pickerMode === 'share'
            ? 'Share with template'
            : 'Download PDF with template'
        }
        onSelect={(templateId) => {
          void onPickTemplate(templateId);
        }}
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
