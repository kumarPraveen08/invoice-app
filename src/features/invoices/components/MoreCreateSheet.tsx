import { router } from 'expo-router';
import { ActionSheet, type SheetAction } from '@/shared/ui';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SOON = 'Coming soon';

export function MoreCreateSheet({ visible, onClose }: Props) {
  const go = (
    path: '/invoice/new' | '/catalogue/new' | '/clients/new',
    params?: Record<string, string>,
  ) => {
    onClose();
    if (params) router.push({ pathname: path, params });
    else router.push(path);
  };

  const actions: SheetAction[] = [
    {
      key: 'invoice',
      label: 'Invoice',
      icon: 'receipt-outline',
      onPress: () => go('/invoice/new'),
    },
    {
      key: 'catalogue',
      label: 'Catalogue item',
      icon: 'grid-outline',
      onPress: () => go('/catalogue/new'),
    },
    {
      key: 'client',
      label: 'Client',
      icon: 'person-add-outline',
      onPress: () => go('/clients/new'),
    },
    {
      key: 'contacts',
      label: 'Client from contacts',
      icon: 'people-outline',
      onPress: () => go('/clients/new', { from: 'contacts' }),
    },
    {
      key: 'estimate',
      label: 'Estimate',
      icon: 'document-text-outline',
      disabled: true,
      badge: SOON,
      onPress: () => undefined,
    },
    {
      key: 'credit-note',
      label: 'Credit note',
      icon: 'return-down-back-outline',
      disabled: true,
      badge: SOON,
      onPress: () => undefined,
    },
    {
      key: 'recurring',
      label: 'Recurring invoice',
      icon: 'repeat-outline',
      disabled: true,
      badge: SOON,
      onPress: () => undefined,
    },
    {
      key: 'purchase-order',
      label: 'Purchase order',
      icon: 'cart-outline',
      disabled: true,
      badge: SOON,
      onPress: () => undefined,
    },
    {
      key: 'expense',
      label: 'Expense',
      icon: 'wallet-outline',
      disabled: true,
      badge: SOON,
      onPress: () => undefined,
    },
  ];

  return (
    <ActionSheet
      visible={visible}
      onClose={onClose}
      title="Create"
      actions={actions}
    />
  );
}
