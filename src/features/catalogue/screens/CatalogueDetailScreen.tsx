import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Text, useTheme } from "@/shared/design-system";
import { formatMoney } from "@/features/invoices/format";
import { useSettingsStore } from "@/features/settings/store";
import { SettingsGroup } from "@/features/settings/components/SettingsList";
import { SettingsScroll } from "@/features/settings/components/SettingsScroll";
import { HeaderIconButton } from "@/shared/ui";
import { useCatalogueStore } from "../store";

function DetailRow({
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
        styles.detailRow,
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
      <Text
        variant="body"
        style={{ fontWeight: "600", flexShrink: 1, textAlign: "right" }}
      >
        {value}
      </Text>
    </View>
  );
}

export default function CatalogueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, space } = useTheme();
  const navigation = useNavigation();
  const currency = useSettingsStore((s) => s.preferences.currency);
  const item = useCatalogueStore((s) => s.items.find((row) => row.id === id));

  useEffect(() => {
    navigation.setOptions({
      title: item?.name ?? "Item",
      headerRight: item
        ? () => (
            <HeaderIconButton
              name="edit"
              label="Edit item"
              color={colors.onSurface}
              onPress={() =>
                router.push({
                  pathname: "/catalogue/new",
                  params: { id: item.id },
                })
              }
            />
          )
        : undefined,
    });
  }, [item, colors.onSurface, navigation]);

  if (!item) {
    return (
      <SettingsScroll>
        <Text variant="body" muted>
          Item not found.
        </Text>
      </SettingsScroll>
    );
  }

  return (
    <SettingsScroll>
      <Text variant="title" style={{ marginBottom: space.xs }}>
        {item.name}
      </Text>
      <Text variant="body" muted style={{ marginBottom: space["2xl"] }}>
        {item.category} · {item.sku}
      </Text>

      <SettingsGroup title="Details">
        <DetailRow label="SKU" value={item.sku} />
        <DetailRow label="Category" value={item.category} />
        <DetailRow label="Unit" value={item.unit} />
        <DetailRow
          label="Selling price"
          value={formatMoney(item.price, currency)}
          last
        />
      </SettingsGroup>
    </SettingsScroll>
  );
}

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
});
