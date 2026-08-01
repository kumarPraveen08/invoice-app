import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Text, useTheme } from '@/shared/design-system';
import {
  isPresetTemplateId,
  listTemplates,
} from '../templateConstants';
import { InvoiceTemplatePreview } from '../components/InvoiceTemplatePreview';
import { SettingsScroll } from '../components/SettingsScroll';
import { useSettingsStore } from '../store';
import { showSnackbar } from '@/shared/ui';

export function InvoiceTemplateScreen() {
  const { colors, radii, space } = useTheme();
  const business = useSettingsStore((s) => s.business);
  const branding = useSettingsStore((s) => s.branding);
  const bank = useSettingsStore((s) => s.bank);
  const defaults = useSettingsStore((s) => s.invoiceDefaults);
  const library = useSettingsStore((s) => s.invoiceTemplates);
  const setDefaultTemplateId = useSettingsStore((s) => s.setDefaultTemplateId);
  const createCustomTemplate = useSettingsStore((s) => s.createCustomTemplate);
  const removeCustomTemplate = useSettingsStore((s) => s.removeCustomTemplate);
  const templates = listTemplates(library.customs);

  const openEditor = (id: string) => {
    if (isPresetTemplateId(id)) {
      const customId = createCustomTemplate(id);
      if (!customId) {
        showSnackbar('Could not create custom template.');
        return;
      }
      router.push({
        pathname: '/settings/invoice-template-edit',
        params: { id: customId },
      });
      return;
    }
    router.push({
      pathname: '/settings/invoice-template-edit',
      params: { id },
    });
  };

  return (
    <SettingsScroll>
      <Text variant="body" muted style={{ marginBottom: space.lg }}>
        Tap a design to set it as default. Customize creates your own editable
        copy. Free plans show watermark and footer branding.
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Create custom template"
        onPress={() => openEditor(library.defaultId)}
        style={({ pressed }) => [
          styles.createBtn,
          {
            borderColor: colors.onSurfaceMuted,
            borderRadius: radii.lg,
            opacity: pressed ? 0.7 : 1,
            marginBottom: space.xl,
          },
        ]}
      >
        <Text variant="label" style={{ color: colors.onSurface }}>
          Customize from default
        </Text>
      </Pressable>

      <View style={[styles.grid, { gap: space.md }]}>
        {templates.map((template) => {
          const isDefault = template.id === library.defaultId;
          const isPreset = isPresetTemplateId(template.id);
          return (
            <View
              key={template.id}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderRadius: radii.lg,
                  borderWidth: isDefault ? 2 : StyleSheet.hairlineWidth,
                  borderColor: isDefault ? colors.primary : colors.background,
                },
              ]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${template.name} template`}
                onPress={() => setDefaultTemplateId(template.id)}
                style={{ padding: space.sm }}
              >
                <InvoiceTemplatePreview
                  template={template}
                  business={business}
                  branding={branding}
                  bank={bank}
                  defaults={defaults}
                  compact
                />
              </Pressable>
              <View
                style={[
                  styles.cardMeta,
                  {
                    paddingHorizontal: space.md,
                    paddingBottom: space.md,
                    gap: space.xs,
                  },
                ]}
              >
                <View style={styles.cardTitleRow}>
                  <Text variant="label" style={{ flex: 1 }} numberOfLines={1}>
                    {template.name}
                  </Text>
                  {isDefault ? (
                    <Text
                      variant="caption"
                      style={{ color: colors.primary, fontWeight: '700' }}
                    >
                      Default
                    </Text>
                  ) : null}
                </View>
                <Text variant="caption" muted>
                  {isPreset ? 'Predesigned' : 'Custom'} · {template.layout}
                </Text>
                <View style={[styles.actions, { gap: space.md, marginTop: 4 }]}>
                  {!isDefault ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => setDefaultTemplateId(template.id)}
                      hitSlop={6}
                    >
                      <Text variant="caption" style={{ color: colors.primary }}>
                        Set default
                      </Text>
                    </Pressable>
                  ) : null}
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => openEditor(template.id)}
                    hitSlop={6}
                  >
                    <Text variant="caption" style={{ color: colors.primary }}>
                      {isPreset ? 'Customize' : 'Edit'}
                    </Text>
                  </Pressable>
                  {!isPreset ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        removeCustomTemplate(template.id);
                        showSnackbar('Custom template removed.');
                      }}
                      hitSlop={6}
                    >
                      <Text variant="caption" muted>
                        Delete
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </SettingsScroll>
  );
}

const styles = StyleSheet.create({
  createBtn: {
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
    paddingVertical: 14,
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    width: '100%',
    overflow: 'hidden',
  },
  cardMeta: {},
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
