import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Icon, Text, useTheme } from "@/shared/design-system";
import { useCatalogueStore } from "@/features/catalogue";
import { useClientsStore } from "@/features/customers";
import { SettingsFlatList } from "@/features/settings/components/SettingsScroll";
import { useSettingsStore } from "@/features/settings/store";
import { SearchField, HeaderIconButton, HeaderTextButton } from "@/shared/ui";
import { formatMoney } from "../format";
import { setInvoicePick } from "../pickResult";

type Mode = "client" | "catalogue";

type PickRow = {
  id: string;
  title: string;
  subtitle: string;
  selected: boolean;
};

export default function InvoicePickScreen() {
  const { colors, space } = useTheme();
  const navigation = useNavigation();
  const { mode: modeParam } = useLocalSearchParams<{ mode?: string }>();
  const mode: Mode = modeParam === "catalogue" ? "catalogue" : "client";
  const clients = useClientsStore((s) => s.clients);
  const catalogue = useCatalogueStore((s) => s.items);
  const currency = useSettingsStore((s) => s.preferences.currency);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  const confirmCatalogue = () => {
    if (picked.length === 0) return;
    setInvoicePick({ type: "catalogue", ids: picked });
    router.back();
  };

  useEffect(() => {
    navigation.setOptions({
      title: mode === "client" ? "Select client" : "Add from catalogue",
      headerRight:
        mode === "catalogue"
          ? () => (
              <HeaderTextButton
                label={picked.length === 0 ? "Add" : `Add (${picked.length})`}
                color={colors.primary}
                disabled={picked.length === 0}
                onPress={confirmCatalogue}
              />
            )
          : () => (
              <HeaderIconButton
                name="person-add"
                label="New client"
                color={colors.onSurface}
                onPress={() => router.push("/clients/new")}
              />
            ),
    });
  }, [mode, navigation, picked, colors.primary, colors.onSurface]);

  const q = query.trim().toLowerCase();

  const rows = useMemo(() => {
    const base: PickRow[] =
      mode === "client"
        ? clients.map((client) => ({
            id: client.id,
            title: client.businessName || client.name,
            subtitle: [
              client.businessName ? client.name : null,
              client.phone || client.email || client.address,
            ]
              .filter(Boolean)
              .join(" · "),
            selected: false,
          }))
        : catalogue.map((item) => ({
            id: item.id,
            title: item.name,
            subtitle: `${item.sku} · ${item.unit} · ${formatMoney(item.price, currency)}`,
            selected: picked.includes(item.id),
          }));
    if (!q) return base;
    return base.filter(
      (row) =>
        row.title.toLowerCase().includes(q) ||
        row.subtitle.toLowerCase().includes(q),
    );
  }, [catalogue, clients, currency, mode, picked, q]);

  const toggle = (id: string) => {
    if (mode === "client") {
      setInvoicePick({ type: "client", id });
      router.back();
      return;
    }
    setPicked((prev) =>
      prev.includes(id) ? prev.filter((row) => row !== id) : [...prev, id],
    );
  };

  return (
    <SettingsFlatList
      data={rows}
      keyExtractor={(row) => row.id}
      title={mode === "client" ? "Clients" : "Catalogue"}
      ListHeaderComponent={
        <View style={{ marginBottom: space.lg }}>
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder={
              mode === "client" ? "Search clients" : "Search catalogue"
            }
            autoFocus
          />
        </View>
      }
      ListEmptyComponent={
        <Text variant="body" muted style={{ marginLeft: space.md }}>
          {q ? `No matches for “${query.trim()}”` : "Nothing to pick yet."}
        </Text>
      }
      renderItem={(row, index) => {
        const last = index === rows.length - 1;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: row.selected }}
            onPress={() => toggle(row.id)}
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
            {mode === "catalogue" ? (
              <Icon
                name={row.selected ? "check-box" : "check-box-outline-blank"}
                size={22}
                color={row.selected ? colors.primary : colors.onSurfaceMuted}
                style={{ marginRight: space.md }}
              />
            ) : null}
            <View style={styles.copy}>
              <Text
                variant="body"
                style={{ fontWeight: "600" }}
                numberOfLines={1}
              >
                {row.title}
              </Text>
              {row.subtitle ? (
                <Text variant="caption" muted numberOfLines={2}>
                  {row.subtitle}
                </Text>
              ) : null}
            </View>
            {mode === "client" ? (
              <Icon
                name="chevron-right"
                size={18}
                color={colors.onSurfaceMuted}
              />
            ) : null}
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
});
