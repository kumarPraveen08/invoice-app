import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import {Icon, Text, useTheme} from '@/shared/design-system';
import { ActionSheet, showSnackbar, SwipeableRow } from '@/shared/ui';
import { formatMoney } from '@/features/invoices/format';
import { useCatalogueStore } from '../store';
import type { CatalogueItem } from '../types';

type Props = {
  item: CatalogueItem;
  currency: string;
  last?: boolean;
};

export function CatalogueRow({ item, currency, last = false }: Props) {
  const { colors, radii, space } = useTheme();
  const removeItem = useCatalogueStore((s) => s.removeItem);
  const upsertItem = useCatalogueStore((s) => s.upsertItem);
  const [actionsOpen, setActionsOpen] = useState(false);

  const onOpen = () => router.push(`/catalogue/${item.id}`);
  const onEdit = () => {
    router.push({ pathname: '/catalogue/new', params: { id: item.id } });
  };
  const onDelete = () => {
    const snapshot = item;
    removeItem(item.id);
    showSnackbar('Item deleted', {
      action: {
        label: 'Undo',
        onPress: () => upsertItem(snapshot),
      },
    });
  };

  return (
    <>
      <SwipeableRow onEdit={onEdit} onDelete={onDelete}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open ${item.name}`}
          onPress={onOpen}
          onLongPress={() => setActionsOpen(true)}
          delayLongPress={280}
          style={[
            styles.row,
            {
              backgroundColor: colors.surface,
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
            <Icon name="inventory-2" size={20} color={colors.primary} />
          </View>
          <View style={styles.copy}>
            <Text variant="body" style={{ fontWeight: '600' }} numberOfLines={1}>
              {item.name}
            </Text>
            <Text variant="caption" muted numberOfLines={1}>
              {item.sku} · {item.unit}
            </Text>
          </View>
          <Text variant="body" style={{ fontWeight: '600' }}>
            {formatMoney(item.price, currency)}
          </Text>
        </Pressable>
      </SwipeableRow>

      <ActionSheet
        visible={actionsOpen}
        onClose={() => setActionsOpen(false)}
        title={item.name}
        subtitle={`${item.sku} · ${item.unit} · ${formatMoney(item.price, currency)}`}
        actions={[
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
            key: 'delete',
            label: 'Delete',
            icon: 'delete',
            destructive: true,
            onPress: onDelete,
          },
        ]}
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
});
