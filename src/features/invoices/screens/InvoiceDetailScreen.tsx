import { useEffect, useState } from "react";
import { Pressable, Share, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { Text, useTheme } from "@/shared/design-system";
import {
  SettingsGroup,
  SettingsRow,
} from "@/features/settings/components/SettingsList";
import { SettingsScroll } from "@/features/settings/components/SettingsScroll";
import { TemplatePickerSheet } from "@/features/settings";
import { useSettingsStore } from "@/features/settings/store";
import { showSnackbar } from "@/shared/ui";
import { STATUS_LABEL, outstandingOf } from "../constants";
import {
  computeInvoiceTotals,
  formatInvoiceDate,
  formatMoney,
} from "../format";
import { downloadInvoicePdf } from "../invoicePdf";
import { buildInvoiceShareMessage } from "../shareMessage";
import { useInvoicesStore } from "../store";

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, space } = useTheme();
  const navigation = useNavigation();
  const currency = useSettingsStore((s) => s.preferences.currency);
  const defaultTemplateId = useSettingsStore(
    (s) => s.invoiceTemplates.defaultId,
  );
  const invoice = useInvoicesStore((s) =>
    s.invoices.find((item) => item.id === id),
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<"share" | "download">("share");

  useEffect(() => {
    if (!invoice) {
      navigation.setOptions({ title: "Invoice", headerRight: undefined });
      return;
    }

    navigation.setOptions({
      title: invoice.number,
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            marginRight: 8,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Share invoice"
            onPress={() => {
              setPickerMode("share");
              setPickerOpen(true);
            }}
            hitSlop={8}
            style={{ padding: 4 }}
          >
            <Ionicons name="share-outline" size={22} color={colors.onSurface} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Download invoice"
            onPress={() => {
              setPickerMode("download");
              setPickerOpen(true);
            }}
            hitSlop={8}
            style={{ padding: 4 }}
          >
            <Ionicons
              name="download-outline"
              size={22}
              color={colors.onSurface}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit invoice"
            onPress={() =>
              router.push({
                pathname: "/invoice/new",
                params: { id: invoice.id },
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
        </View>
      ),
    });
  }, [colors.onSurface, invoice, navigation]);

  const onPickTemplate = async (templateId: string) => {
    if (!invoice) return;
    try {
      if (pickerMode === "share") {
        const message = buildInvoiceShareMessage(
          invoice,
          currency,
          templateId,
        );
        await Share.share({ title: invoice.number, message });
        return;
      }
      await downloadInvoicePdf(invoice, currency, templateId);
      showSnackbar("PDF ready to save or share");
    } catch (error) {
      showSnackbar(
        error instanceof Error
          ? error.message
          : pickerMode === "share"
            ? "Could not share invoice."
            : "Could not download PDF.",
      );
    }
  };

  if (!invoice) {
    return (
      <SettingsScroll>
        <Text variant="body" muted>
          Invoice not found.
        </Text>
      </SettingsScroll>
    );
  }

  const balance = outstandingOf(invoice);
  const totals = computeInvoiceTotals({
    lines: invoice.lines,
    discount: invoice.discount,
    taxRate: invoice.taxRate,
    additionalCharges: invoice.additionalCharges,
  });

  return (
    <>
      <SettingsScroll>
        <Text variant="title" style={{ marginBottom: space.xs }}>
          {invoice.customerName}
        </Text>
        <Text variant="body" muted style={{ marginBottom: space["2xl"] }}>
          {invoice.number} · {STATUS_LABEL[invoice.status]}
        </Text>

        <SettingsGroup title="Summary">
          <SettingsRow
            icon="cash-outline"
            title="Total"
            subtitle={formatMoney(invoice.total, currency)}
            showChevron={false}
          />
          <SettingsRow
            icon="wallet-outline"
            title="Paid"
            subtitle={formatMoney(invoice.paid, currency)}
            showChevron={false}
          />
          <SettingsRow
            icon="time-outline"
            title="Outstanding"
            subtitle={formatMoney(balance, currency)}
            showChevron={false}
            last
          />
        </SettingsGroup>

        <SettingsGroup title="Dates">
          <SettingsRow
            icon="calendar-outline"
            title="Issued"
            subtitle={formatInvoiceDate(invoice.issueDate)}
            showChevron={false}
          />
          <SettingsRow
            icon="flag-outline"
            title="Due"
            subtitle={formatInvoiceDate(invoice.dueDate)}
            showChevron={false}
            last
          />
        </SettingsGroup>

        {invoice.lines.length > 0 ? (
          <SettingsGroup title="Items">
            {invoice.lines.map((line, index) => (
              <SettingsRow
                key={line.id}
                icon="cube-outline"
                title={line.name}
                subtitle={`${line.quantity} × ${formatMoney(line.unitPrice, currency)}`}
                showChevron={false}
                last={index === invoice.lines.length - 1}
              />
            ))}
          </SettingsGroup>
        ) : null}

        <SettingsGroup title="Totals">
          <SettingsRow
            icon="list-outline"
            title="Subtotal"
            subtitle={formatMoney(totals.subtotal, currency)}
            showChevron={false}
          />
          <SettingsRow
            icon="pricetag-outline"
            title="Discount"
            subtitle={formatMoney(totals.discount, currency)}
            showChevron={false}
          />
          <SettingsRow
            icon="calculator-outline"
            title={`Tax (${invoice.taxRate}%)`}
            subtitle={formatMoney(totals.tax, currency)}
            showChevron={false}
          />
          <SettingsRow
            icon="add-circle-outline"
            title="Additional charges"
            subtitle={formatMoney(totals.additionalCharges, currency)}
            showChevron={false}
            last
          />
        </SettingsGroup>

        {invoice.notes || invoice.terms || invoice.paymentInstructions ? (
          <View style={{ marginBottom: space.xl, gap: space.md }}>
            {invoice.notes ? (
              <View>
                <Text variant="caption" muted>
                  Notes
                </Text>
                <Text variant="body">{invoice.notes}</Text>
              </View>
            ) : null}
            {invoice.terms ? (
              <View>
                <Text variant="caption" muted>
                  Terms
                </Text>
                <Text variant="body">{invoice.terms}</Text>
              </View>
            ) : null}
            {invoice.paymentInstructions ? (
              <View>
                <Text variant="caption" muted>
                  Payment instructions
                </Text>
                <Text variant="body">{invoice.paymentInstructions}</Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </SettingsScroll>

      <TemplatePickerSheet
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title={
          pickerMode === "share"
            ? "Share with template"
            : "Download PDF with template"
        }
        onSelect={(templateId) => {
          void onPickTemplate(templateId || defaultTemplateId);
        }}
      />
    </>
  );
}
