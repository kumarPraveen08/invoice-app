import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Text, useTheme } from '@/shared/design-system';
import { ActionSheet, SwipeableRow } from '@/shared/ui';
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
  const [actionsOpen, setActionsOpen] = useState(false);

  const onOpen = () => router.push(`/catalogue/${item.id}`);
  const onEdit = () => {
    router.push({ pathname: '/catalogue/new', params: { id: item.id } });
  };
  const onDelete = () => {
    Alert.alert('Delete item', `Remove “${item.name}”?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeItem(item.id),
      },
    ]);
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
            <Ionicons name="cube-outline" size={20} color={colors.primary} />
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
        actions={[
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
            key: 'delete',
            label: 'Delete',
            icon: 'trash-outline',
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
