import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { useTheme } from '@/shared/design-system';

type Props = TextInputProps & {
  value: string;
  onChangeText: (text: string) => void;
  onClose?: () => void;
};

/** M3 expanded search field (full-screen search layer). */
export function InvoiceSearchField({
  value,
  onChangeText,
  onClose,
  ...props
}: Props) {
  const { colors, radii, space } = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.surface,
          borderRadius: radii.full,
          paddingHorizontal: space.md,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close search"
        onPress={onClose ?? (() => router.back())}
        hitSlop={8}
        style={styles.iconBtn}
      >
        <Ionicons name="arrow-back" size={22} color={colors.onSurface} />
      </Pressable>
      <TextInput
        {...props}
        value={value}
        onChangeText={onChangeText}
        placeholder="Search invoices"
        placeholderTextColor={colors.onSurfaceMuted}
        autoFocus
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="never"
        style={[styles.input, { color: colors.onSurface, marginHorizontal: space.sm }]}
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear"
          onPress={() => onChangeText('')}
          hitSlop={8}
          style={styles.iconBtn}
        >
          <Ionicons name="close-circle" size={20} color={colors.onSurfaceMuted} />
        </Pressable>
      ) : (
        <View style={styles.iconBtn}>
          <Ionicons name="search" size={20} color={colors.onSurfaceMuted} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 0,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
