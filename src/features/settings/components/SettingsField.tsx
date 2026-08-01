import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { Text, useTheme } from '@/shared/design-system';

type FieldProps = TextInputProps & {
  label: string;
};

export function SettingsField({ label, multiline, style, ...props }: FieldProps) {
  const { colors, space } = useTheme();

  return (
    <View style={{ marginBottom: space.xl }}>
      <Text variant="caption" muted style={styles.label}>
        {label}
      </Text>
      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor={colors.onSurfaceMuted}
        style={[
          styles.input,
          {
            color: colors.onSurface,
            borderBottomColor: colors.onSurfaceMuted,
            paddingVertical: multiline ? space.md : space.sm + 2,
            minHeight: multiline ? 96 : undefined,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  input: {
    fontSize: 17,
    lineHeight: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 0,
  },
});
