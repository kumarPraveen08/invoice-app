import { Image, Platform, StyleSheet, View } from "react-native";
import { Text } from "@/shared/design-system";
import {
  FREE_FOOTER_COPYRIGHT,
  FREE_PLAN_BRANDING,
  FREE_WATERMARK_LABEL,
} from "../templateConstants";
import type {
  BankDetails,
  BrandingDetails,
  BusinessDetails,
  InvoiceDefaults,
  InvoiceTemplate,
} from "../types";

type Props = {
  template: InvoiceTemplate;
  business: BusinessDetails;
  branding: BrandingDetails;
  bank: BankDetails;
  defaults: InvoiceDefaults;
  /** Free-plan watermark + footer. Defaults to FREE_PLAN_BRANDING. */
  freeBranding?: boolean;
  /** Compact thumbnail for gallery cards. */
  compact?: boolean;
};

function fontFamily(font: InvoiceTemplate["font"]): string | undefined {
  switch (font) {
    case "serif":
      return Platform.select({
        ios: "Georgia",
        android: "serif",
        default: "serif",
      });
    case "mono":
      return Platform.select({
        ios: "Menlo",
        android: "monospace",
        default: "monospace",
      });
    case "rounded":
      return Platform.select({
        ios: "Avenir Next",
        android: "sans-serif-medium",
        default: undefined,
      });
    case "condensed":
      return Platform.select({
        ios: "AvenirNextCondensed-DemiBold",
        android: "sans-serif-condensed",
        default: undefined,
      });
    case "times":
      return Platform.select({
        ios: "Times New Roman",
        android: "serif",
        default: "serif",
      });
    case "sans":
    default:
      return undefined;
  }
}

const SAMPLE_LINES = [
  { name: "Design consultation", qty: "1", amount: "12,000.00" },
  { name: "Website setup", qty: "1", amount: "8,500.00" },
];

export function InvoiceTemplatePreview({
  template,
  business,
  branding,
  bank,
  defaults,
  freeBranding = FREE_PLAN_BRANDING,
  compact = false,
}: Props) {
  const { layout, accent, font, fields } = template;
  const ff = fontFamily(font);
  const biz = business.name.trim() || "Your business";
  const logoInitial = (() => {
    const parts = biz.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
    }
    return (parts[0]?.slice(0, 2) || "B").toUpperCase();
  })();
  const dense = layout === "compact" || compact;
  const pad = dense ? 10 : 16;
  const ink = "#1C1B1F";
  const muted = "#5C5A62";
  const line = "#E7E0EC";
  const gap = dense ? 8 : 12;

  const text = (
    size: number,
    weight: "400" | "600" | "700" = "400",
    color = ink,
  ) => ({
    fontFamily: ff,
    fontSize: size,
    fontWeight: weight,
    color,
    lineHeight: size + 4,
  });

  const renderLogo = (onDark: boolean) => {
    if (!fields.logo) return null;
    if (branding.logoUri) {
      return <Image source={{ uri: branding.logoUri }} style={styles.logo} />;
    }
    return (
      <View
        style={[
          styles.logoPlaceholder,
          {
            backgroundColor: onDark ? "rgba(255,255,255,0.22)" : `${accent}22`,
          },
        ]}
      >
        <Text
          style={text(compact ? 10 : 12, "700", onDark ? "#FFFFFF" : accent)}
        >
          {logoInitial}
        </Text>
      </View>
    );
  };

  const invoiceMeta = (
    <View style={{ alignItems: "flex-end", gap: 2 }}>
      <Text style={text(14, "700", accent)}>INVOICE</Text>
      <Text style={text(9, "400", muted)}>INV-1001</Text>
      <Text style={text(9, "400", muted)}>1 Aug 2026</Text>
      {fields.dueDate ? (
        <Text style={text(9, "400", muted)}>Due 15 Aug 2026</Text>
      ) : null}
    </View>
  );

  const businessBlock = (
    <View style={{ gap: 4 }}>
      {renderLogo(false)}
      <Text style={text(13, "700")}>{biz}</Text>
      {fields.businessAddress && business.address ? (
        <Text style={text(9, "400", muted)} numberOfLines={2}>
          {business.address}
        </Text>
      ) : null}
      {fields.taxNumber && business.taxNumber ? (
        <Text style={text(9, "400", muted)}>Tax: {business.taxNumber}</Text>
      ) : null}
    </View>
  );

  const renderHeader = () => {
    if (layout === "modern") {
      return (
        <View
          style={[
            styles.modernHeader,
            {
              backgroundColor: accent,
              margin: -pad,
              marginBottom: pad,
              padding: pad,
            },
          ]}
        >
          <View style={styles.headerRow}>
            {renderLogo(true)}
            <View style={{ flex: 1 }}>
              <Text style={text(14, "700", "#FFFFFF")}>{biz}</Text>
              {fields.businessAddress && business.address ? (
                <Text
                  style={text(9, "400", "rgba(255,255,255,0.85)")}
                  numberOfLines={2}
                >
                  {business.address}
                </Text>
              ) : null}
            </View>
            <Text style={text(12, "700", "#FFFFFF")}>INVOICE</Text>
          </View>
        </View>
      );
    }

    if (layout === "stripe") {
      return (
        <>
          <View
            style={{
              height: 6,
              backgroundColor: accent,
              marginHorizontal: -pad,
              marginTop: -pad,
              marginBottom: gap,
            }}
          />
          <View style={[styles.headerRow, { marginBottom: gap }]}>
            <View style={{ flex: 1 }}>{businessBlock}</View>
            {invoiceMeta}
          </View>
        </>
      );
    }

    if (layout === "centered") {
      return (
        <View style={{ alignItems: "center", marginBottom: gap, gap: 6 }}>
          {renderLogo(false)}
          <Text style={[text(14, "700"), { textAlign: "center" }]}>{biz}</Text>
          {fields.businessAddress && business.address ? (
            <Text
              style={[text(9, "400", muted), { textAlign: "center" }]}
              numberOfLines={2}
            >
              {business.address}
            </Text>
          ) : null}
          <View style={{ height: 1, width: "40%", backgroundColor: accent }} />
          <Text style={text(12, "700", accent)}>INVOICE</Text>
          <Text style={text(9, "400", muted)}>INV-1001 · 1 Aug 2026</Text>
          {fields.dueDate ? (
            <Text style={text(9, "400", muted)}>Due 15 Aug 2026</Text>
          ) : null}
        </View>
      );
    }

    if (layout === "formal") {
      return (
        <View style={{ marginBottom: gap }}>
          <View style={[styles.headerRow, { marginBottom: 8 }]}>
            <View style={{ flex: 1 }}>
              <Text style={text(18, "700", accent)}>INVOICE</Text>
              <Text style={text(9, "400", muted)}>INV-1001</Text>
            </View>
            <View style={{ alignItems: "flex-end", flex: 1 }}>
              {businessBlock}
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: accent }} />
          <View
            style={{
              height: 1,
              backgroundColor: accent,
              marginTop: 2,
              marginBottom: 8,
            }}
          />
          <View style={styles.metaRow}>
            <Text style={text(9, "400", muted)}>1 Aug 2026</Text>
            {fields.dueDate ? (
              <Text style={text(9, "400", muted)}>Due 15 Aug 2026</Text>
            ) : null}
            {fields.taxNumber && business.taxNumber ? (
              <Text style={text(9, "400", muted)}>
                Tax: {business.taxNumber}
              </Text>
            ) : null}
          </View>
        </View>
      );
    }

    // classic + compact
    return (
      <>
        <View style={[styles.headerRow, { marginBottom: gap }]}>
          <View style={{ flex: 1 }}>{businessBlock}</View>
          {invoiceMeta}
        </View>
        {layout === "classic" ? (
          <View
            style={{ height: 2, backgroundColor: accent, marginBottom: gap }}
          />
        ) : null}
      </>
    );
  };

  const renderBillTo = () => {
    if (layout === "modern") {
      return (
        <View style={[styles.metaRow, { marginBottom: gap }]}>
          <View>
            <Text style={text(8, "600", muted)}>BILL TO</Text>
            <Text style={text(10, "600")}>Acme Studio</Text>
            <Text style={text(9, "400", muted)}>Jane Cooper</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={text(9, "400", muted)}>INV-1001</Text>
            <Text style={text(9, "400", muted)}>1 Aug 2026</Text>
            {fields.dueDate ? (
              <Text style={text(9, "400", muted)}>Due 15 Aug 2026</Text>
            ) : null}
            {fields.taxNumber && business.taxNumber ? (
              <Text style={text(9, "400", muted)}>
                Tax: {business.taxNumber}
              </Text>
            ) : null}
          </View>
        </View>
      );
    }

    if (layout === "centered") {
      return (
        <View style={{ alignItems: "center", marginBottom: gap }}>
          <Text style={text(8, "600", muted)}>BILL TO</Text>
          <Text style={text(10, "600")}>Acme Studio</Text>
          <Text style={text(9, "400", muted)}>Jane Cooper</Text>
        </View>
      );
    }

    return (
      <View style={{ marginBottom: gap }}>
        <Text style={text(8, "600", muted)}>BILL TO</Text>
        <Text style={text(10, "600")}>Acme Studio</Text>
        <Text style={text(9, "400", muted)}>Jane Cooper</Text>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.paper,
        {
          padding: pad,
          paddingBottom: freeBranding ? pad + 14 : pad,
          borderLeftWidth: layout === "compact" ? 3 : 0,
          borderLeftColor: accent,
        },
      ]}
    >
      {renderHeader()}
      {renderBillTo()}

      <View
        style={[styles.tableHead, { borderBottomColor: line, marginBottom: 4 }]}
      >
        <Text style={[text(8, "600", muted), { flex: 1 }]}>ITEM</Text>
        <Text
          style={[text(8, "600", muted), { width: 28, textAlign: "right" }]}
        >
          QTY
        </Text>
        <Text
          style={[text(8, "600", muted), { width: 64, textAlign: "right" }]}
        >
          AMOUNT
        </Text>
      </View>
      {SAMPLE_LINES.map((lineItem) => (
        <View
          key={lineItem.name}
          style={[styles.tableRow, { paddingVertical: dense ? 3 : 5 }]}
        >
          <Text style={[text(9, "400"), { flex: 1 }]} numberOfLines={1}>
            {lineItem.name}
          </Text>
          <Text
            style={[text(9, "400", muted), { width: 28, textAlign: "right" }]}
          >
            {lineItem.qty}
          </Text>
          <Text style={[text(9, "400"), { width: 64, textAlign: "right" }]}>
            {lineItem.amount}
          </Text>
        </View>
      ))}

      <View
        style={[
          styles.totals,
          { borderTopColor: line, marginTop: dense ? 6 : 10 },
        ]}
      >
        <Text style={text(9, "400", muted)}>Subtotal</Text>
        <Text style={text(9, "400")}>20,500.00</Text>
        <Text style={text(9, "400", muted)}>Tax</Text>
        <Text style={text(9, "400")}>3,690.00</Text>
        <Text style={text(11, "700", accent)}>Total</Text>
        <Text style={text(11, "700", accent)}>24,190.00</Text>
      </View>

      {(fields.notes ||
        fields.terms ||
        fields.bankDetails ||
        fields.signature) && (
        <View style={{ marginTop: dense ? 8 : 12, gap: dense ? 4 : 6 }}>
          {fields.notes ? (
            <View>
              <Text style={text(8, "600", muted)}>NOTES</Text>
              <Text style={text(9, "400")} numberOfLines={2}>
                {defaults.notes.trim() || "Thank you for your business."}
              </Text>
            </View>
          ) : null}
          {fields.terms ? (
            <View>
              <Text style={text(8, "600", muted)}>TERMS</Text>
              <Text style={text(9, "400")} numberOfLines={2}>
                {defaults.terms.trim() || "Payment due within 15 days."}
              </Text>
            </View>
          ) : null}
          {fields.bankDetails && (bank.bankName || bank.accountNumber) ? (
            <View>
              <Text style={text(8, "600", muted)}>PAYMENT</Text>
              <Text style={text(9, "400")} numberOfLines={2}>
                {[bank.bankName, bank.accountName, bank.accountNumber]
                  .filter(Boolean)
                  .join(" · ") || "Bank details"}
              </Text>
            </View>
          ) : null}
          {fields.signature ? (
            <View style={{ alignItems: "flex-end", marginTop: 4 }}>
              {branding.signatureUri ? (
                <Image
                  source={{ uri: branding.signatureUri }}
                  style={styles.signature}
                />
              ) : (
                <View
                  style={[styles.signatureLine, { borderBottomColor: muted }]}
                />
              )}
              <Text style={text(9, "400", muted)}>
                {branding.signatureName.trim() || "Authorized signature"}
              </Text>
            </View>
          ) : null}
        </View>
      )}

      {freeBranding ? (
        <>
          <View pointerEvents="none" style={styles.watermark}>
            <Text
              style={[
                text(compact ? 14 : 18, "700", accent),
                {
                  opacity: 0.1,
                  transform: [{ rotate: "-28deg" }],
                },
              ]}
            >
              {FREE_WATERMARK_LABEL}
            </Text>
          </View>
          <View style={styles.footerBrand}>
            <Text style={text(7, "400", muted)}>{FREE_FOOTER_COPYRIGHT}</Text>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  paper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    overflow: "hidden",
    width: "100%",
    // A4 portrait (210 × 297 mm)
    aspectRatio: 210 / 297,
  },
  modernHeader: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  headerRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 4,
    resizeMode: "contain",
  },
  logoPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  totals: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
    alignSelf: "flex-end",
    width: "55%",
    gap: 3,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  signature: {
    width: 72,
    height: 28,
    resizeMode: "contain",
    marginBottom: 2,
  },
  signatureLine: {
    width: 80,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 4,
  },
  watermark: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  footerBrand: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 6,
    alignItems: "center",
  },
});
