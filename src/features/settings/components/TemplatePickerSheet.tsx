import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, useTheme } from '@/shared/design-system';
import { BottomSheet } from '@/shared/ui';
import { listTemplates } from '../templateConstants';
import { useSettingsStore } from '../store';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (templateId: string) => void;
  title?: string;
};

export function TemplatePickerSheet({
  visible,
  onClose,
  onSelect,
  title = 'Choose template',
}: Props) {
  const { colors, space } = useTheme();
  const customs = useSettingsStore((s) => s.invoiceTemplates.customs);
  const defaultId = useSettingsStore((s) => s.invoiceTemplates.defaultId);
  const templates = listTemplates(customs);

  return (
    <BottomSheet visible={visible} onClose={onClose} title={title}>
      {templates.map((template) => {
        const isDefault = template.id === defaultId;
        return (
          <Pressable
            key={template.id}
            accessibilityRole="button"
            accessibilityLabel={template.name}
            onPress={() => {
              onSelect(template.id);
              onClose();
            }}
            style={({ pressed }) => [
              styles.row,
              {
                paddingVertical: space.md,
                opacity: pressed ? 0.7 : 1,
                borderBottomColor: colors.background,
              },
            ]}
          >
            <View
              style={[
                styles.swatch,
                { backgroundColor: template.accent, marginRight: space.md },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text variant="body" style={{ fontWeight: '600' }}>
                {template.name}
              </Text>
              <Text variant="caption" muted>
                {template.layout}
                {isDefault ? ' · Default' : ''}
              </Text>
            </View>
            {isDefault ? (
              <Ionicons name="checkmark" size={20} color={colors.primary} />
            ) : null}
          </Pressable>
        );
      })}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
});
