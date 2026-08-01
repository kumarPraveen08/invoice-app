import { useEffect, useMemo } from "react";
import { Pressable, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Text, useTheme } from "@/shared/design-system";
import { InvoiceRow } from "@/features/invoices/components/InvoiceRow";
import { outstandingOf } from "@/features/invoices/constants";
import { formatMoney } from "@/features/invoices/format";
import { useInvoicesStore } from "@/features/invoices";
import { useSettingsStore } from "@/features/settings";
import { SettingsGroup } from "@/features/settings/components/SettingsList";
import { SettingsScroll } from "@/features/settings/components/SettingsScroll";
import { useClientsStore } from "../store";
import type { Client } from "../types";

function invoicesForClient(customerName: string, client: Client): boolean {
  return customerName === client.businessName || customerName === client.name;
}

export default function ClientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, space } = useTheme();
  const navigation = useNavigation();
  const currency = useSettingsStore((s) => s.preferences.currency);
  const client = useClientsStore((s) => s.clients.find((c) => c.id === id));
  const invoices = useInvoicesStore((s) => s.invoices);

  const clientInvoices = useMemo(() => {
    if (!client) return [];
    return invoices
      .filter((invoice) => invoicesForClient(invoice.customerName, client))
      .sort((a, b) => b.issueDate.localeCompare(a.issueDate));
  }, [client, invoices]);

  const totals = useMemo(() => {
    let billed = 0;
    let unpaid = 0;
    for (const invoice of clientInvoices) {
      billed += invoice.total;
      unpaid += outstandingOf(invoice);
    }
    return { billed, unpaid };
  }, [clientInvoices]);

  useEffect(() => {
    navigation.setOptions({
      title: client?.name ?? "Client",
      headerRight: client
        ? () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit client"
              onPress={() =>
                router.push({
                  pathname: "/clients/new",
                  params: { id: client.id },
                })
              }
              hitSlop={8}
            >
              <Ionicons
                name="pencil-outline"
                size={22}
                color={colors.onSurface}
              />
            </Pressable>
          )
        : undefined,
    });
  }, [client, colors.onSurface, navigation]);

  if (!client) {
    return (
      <SettingsScroll>
        <Text variant="body" muted>
          Client not found.
        </Text>
      </SettingsScroll>
    );
  }

  return (
    <SettingsScroll>
      <Text variant="title" style={{ marginBottom: space.xs }}>
        {client.name}
      </Text>
      <Text variant="body" muted style={{ marginBottom: space["2xl"] }}>
        {client.businessName}
      </Text>

      <SettingsGroup title="Contact">
        <View
          style={{ paddingHorizontal: space.lg, paddingVertical: space.md }}
        >
          <Text variant="body" style={{ fontWeight: "600" }}>
            {client.email || "No email"}
          </Text>
          <Text variant="caption" muted style={{ marginTop: 4 }}>
            {client.phone || "No phone"}
          </Text>
        </View>
      </SettingsGroup>

      <SettingsGroup title="With you">
        <View
          style={{
            paddingHorizontal: space.lg,
            paddingVertical: space.md,
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text variant="caption" muted>
              Billed
            </Text>
            <Text variant="body" style={{ fontWeight: "700", marginTop: 2 }}>
              {formatMoney(totals.billed, currency)}
            </Text>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text variant="caption" muted>
              Still unpaid
            </Text>
            <Text variant="body" style={{ fontWeight: "700", marginTop: 2 }}>
              {formatMoney(totals.unpaid, currency)}
            </Text>
          </View>
        </View>
      </SettingsGroup>

      {clientInvoices.length === 0 ? (
        <Text variant="body" muted style={{ marginLeft: space.md }}>
          No invoices for this client yet.
        </Text>
      ) : (
        <SettingsGroup title={`Invoices · ${clientInvoices.length}`}>
          {clientInvoices.map((invoice, index) => (
            <InvoiceRow
              key={invoice.id}
              invoice={invoice}
              currency={currency}
              last={index === clientInvoices.length - 1}
              onPress={() => router.push(`/invoice/${invoice.id}`)}
            />
          ))}
        </SettingsGroup>
      )}
    </SettingsScroll>
  );
}
