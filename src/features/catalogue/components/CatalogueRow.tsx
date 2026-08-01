import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@/shared/design-system';
import { formatMoney } from '@/features/invoices/format';
import type { CatalogueItem } from '../types';

type Props = {
  item: CatalogueItem;
  currency: string;
  last?: boolean;
};

export function CatalogueRow({ item, currency, last = false }: Props) {
  const { colors, radii, space } = useTheme();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        {
          paddingHorizontal: space.lg,
          paddingVertical: space.md,
          opacity: pressed ? 0.72 : 1,
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
