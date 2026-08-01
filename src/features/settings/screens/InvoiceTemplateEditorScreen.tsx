import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen, Text, useTheme } from "@/shared/design-system";
import { BottomSheet, showSnackbar } from "@/shared/ui";
import { InvoiceTemplatePreview } from "../components/InvoiceTemplatePreview";
import {
  findTemplate,
  isPresetTemplateId,
  TEMPLATE_ACCENTS,
  TEMPLATE_FIELD_ROWS,
  TEMPLATE_FONTS,
  TEMPLATE_LAYOUTS,
} from "../templateConstants";
import type { InvoiceTemplateFont, InvoiceTemplateLayout } from "../types";
import { useSettingsStore } from "../store";

type Tool = "style" | "type" | "fields" | null;

export function InvoiceTemplateEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, radii, space } = useTheme();
  const insets = useSafeAreaInsets();
  const [tool, setTool] = useState<Tool>(null);

  const business = useSettingsStore((s) => s.business);
  const branding = useSettingsStore((s) => s.branding);
  const bank = useSettingsStore((s) => s.bank);
  const defaults = useSettingsStore((s) => s.invoiceDefaults);
  const customs = useSettingsStore((s) => s.invoiceTemplates.customs);
  const defaultId = useSettingsStore((s) => s.invoiceTemplates.defaultId);
  const setDefaultTemplateId = useSettingsStore((s) => s.setDefaultTemplateId);
  const updateCustomTemplate = useSettingsStore((s) => s.updateCustomTemplate);
  const updateCustomTemplateFields = useSettingsStore(
    (s) => s.updateCustomTemplateFields,
  );

  const template = useMemo(
    () => (id ? findTemplate(id, customs) : undefined),
    [id, customs],
  );

  if (!template || !id || isPresetTemplateId(id)) {
    return (
      <Screen>
        <View style={{ padding: space.lg }}>
          <Text variant="body" muted>
            Template not found. Customize a preset from the library first.
          </Text>
        </View>
      </Screen>
    );
  }

  const toggleTool = (next: Tool) => {
    setTool((current) => (current === next ? null : next));
  };

  return (
    <Screen>
      <View style={styles.root}>
        <View
          style={[
            styles.topBar,
            {
              paddingHorizontal: space.lg,
              paddingTop: space.sm,
              paddingBottom: space.sm,
              borderBottomColor: colors.surface,
            },
          ]}
        >
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text variant="subtitle" numberOfLines={1}>
              {template.name}
            </Text>
            <Text variant="caption" muted>
              {defaultId === template.id ? "Default template" : "Custom"}
            </Text>
          </View>
          {defaultId !== template.id ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setDefaultTemplateId(template.id);
                showSnackbar("Default template updated.");
              }}
              hitSlop={8}
            >
              <Text variant="label" style={{ color: colors.primary }}>
                Set default
              </Text>
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          style={styles.canvas}
          contentContainerStyle={{
            paddingHorizontal: space.lg,
            paddingVertical: space.lg,
            paddingBottom: space["2xl"],
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <InvoiceTemplatePreview
            template={template}
            business={business}
            branding={branding}
            bank={bank}
            defaults={defaults}
          />
        </ScrollView>

        {tool === "style" ? (
          <View
            style={[
              styles.panel,
              {
                backgroundColor: colors.surface,
                paddingHorizontal: space.lg,
                paddingVertical: space.md,
                borderTopColor: colors.background,
              },
            ]}
          >
            <Text variant="caption" muted style={styles.panelLabel}>
              Layout
            </Text>
            <View
              style={[
                styles.chipRow,
                { gap: space.sm, marginBottom: space.md },
              ]}
            >
              {TEMPLATE_LAYOUTS.map((option) => {
                const selected = template.layout === option.id;
                return (
                  <Pressable
                    key={option.id}
                    onPress={() =>
                      updateCustomTemplate(id, {
                        layout: option.id as InvoiceTemplateLayout,
                      })
                    }
                    style={[
                      styles.chip,
                      {
                        borderRadius: radii.full,
                        backgroundColor: selected
                          ? colors.primary
                          : colors.background,
                      },
                    ]}
                  >
                    <Text
                      variant="caption"
                      style={{
                        color: selected ? colors.onPrimary : colors.onSurface,
                        fontWeight: "600",
                      }}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text variant="caption" muted style={styles.panelLabel}>
              Accent
            </Text>
            <View style={[styles.chipRow, { gap: space.md }]}>
              {TEMPLATE_ACCENTS.map((hex) => {
                const selected = template.accent === hex;
                return (
                  <Pressable
                    key={hex}
                    onPress={() => updateCustomTemplate(id, { accent: hex })}
                    style={{
                      padding: 2,
                      borderRadius: 16,
                      borderWidth: 2,
                      borderColor: selected ? colors.onSurface : "transparent",
                    }}
                  >
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: hex,
                      }}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        {tool === "type" ? (
          <View
            style={[
              styles.panel,
              {
                backgroundColor: colors.surface,
                paddingHorizontal: space.lg,
                paddingVertical: space.md,
                borderTopColor: colors.background,
              },
            ]}
          >
            <Text variant="caption" muted style={styles.panelLabel}>
              Typeface
            </Text>
            <View style={[styles.chipRow, { gap: space.sm }]}>
              {TEMPLATE_FONTS.map((option) => {
                const selected = template.font === option.id;
                return (
                  <Pressable
                    key={option.id}
                    onPress={() =>
                      updateCustomTemplate(id, {
                        font: option.id as InvoiceTemplateFont,
                      })
                    }
                    style={[
                      styles.chip,
                      {
                        borderRadius: radii.full,
                        backgroundColor: selected
                          ? colors.primary
                          : colors.background,
                      },
                    ]}
                  >
                    <Text
                      variant="caption"
                      style={{
                        color: selected ? colors.onPrimary : colors.onSurface,
                        fontWeight: "600",
                      }}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}

        <View
          style={[
            styles.dock,
            {
              backgroundColor: colors.surface,
              paddingBottom: Math.max(insets.bottom, space.sm),
              borderTopColor: colors.background,
            },
          ]}
        >
          {(
            [
              {
                id: "style" as const,
                icon: "color-palette-outline",
                label: "Style",
              },
              { id: "type" as const, icon: "text-outline", label: "Type" },
              {
                id: "fields" as const,
                icon: "options-outline",
                label: "Fields",
              },
              {
                id: "more" as const,
                icon: "ellipsis-horizontal",
                label: "More",
              },
            ] as const
          ).map((item) => {
            const active = item.id === "more" ? false : tool === item.id;
            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                onPress={() => {
                  if (item.id === "more") {
                    router.push("/settings/branding");
                    return;
                  }
                  if (item.id === "fields") {
                    setTool("fields");
                    return;
                  }
                  toggleTool(item.id);
                }}
                style={({ pressed }) => [
                  styles.dockItem,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={active ? colors.primary : colors.onSurfaceMuted}
                />
                <Text
                  variant="caption"
                  style={{
                    color: active ? colors.primary : colors.onSurfaceMuted,
                    fontWeight: active ? "700" : "400",
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <BottomSheet
        visible={tool === "fields"}
        onClose={() => setTool(null)}
        title="Show on invoice"
      >
        {TEMPLATE_FIELD_ROWS.map((row) => (
          <View
            key={row.key}
            style={[
              styles.fieldRow,
              {
                paddingVertical: space.sm,
                borderBottomColor: colors.background,
              },
            ]}
          >
            <Text variant="body" style={{ flex: 1 }}>
              {row.label}
            </Text>
            <Switch
              value={template.fields[row.key]}
              onValueChange={(value) =>
                updateCustomTemplateFields(id, { [row.key]: value })
              }
              trackColor={{
                false: colors.background,
                true: colors.primary,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        ))}
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  canvas: {
    flex: 1,
  },
  panel: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  panelLabel: {
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  dock: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  dockItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    paddingVertical: 4,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
