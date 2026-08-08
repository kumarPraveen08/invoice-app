import type { ReactNode } from "react";
import { Pressable, StyleSheet, View, type ColorValue } from "react-native";
import { Icon, Text, type IconName } from "@/shared/design-system";

type IconProps = {
  name: IconName;
  label: string;
  onPress: () => void;
  color: ColorValue;
  disabled?: boolean;
};

/**
 * Material 3 TopAppBar IconButton — 48dp touch target, 24dp icon.
 * @see https://m3.material.io/components/app-bars/guidelines
 */
export function HeaderIconButton({
  name,
  label,
  onPress,
  color,
  disabled,
}: IconProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        disabled ? styles.disabled : pressed ? styles.pressed : null,
      ]}
    >
      <Icon name={name} size={24} color={color} />
    </Pressable>
  );
}

type TextProps = {
  label: string;
  onPress: () => void;
  color: ColorValue;
  disabled?: boolean;
};

/** Trailing text action for TopAppBar (e.g. Add). */
export function HeaderTextButton({
  label,
  onPress,
  color,
  disabled,
}: TextProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.textButton,
        disabled ? styles.disabled : pressed ? styles.pressed : null,
      ]}
    >
      <Text variant="body" style={{ color, fontWeight: "700" }}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Flush row of TopAppBar actions — no extra gap (M3 IconButtons sit adjacent). */
export function HeaderActionRow({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

/** Tab / JS headers — no extra native inset. */
export const headerIconContainerStyle = {
  headerLeftContainerStyle: { paddingLeft: 0 },
  headerRightContainerStyle: { paddingRight: 0 },
} as const;

/**
 * Native-stack (invoice/client/settings pushes) adds ~16dp side inset.
 * Cancel it so icons match the tab header edge spacing.
 */
export const stackHeaderIconContainerStyle = {
  headerLeftContainerStyle: {
    paddingHorizontal: 0,
    marginLeft: 16,
  },
  headerRightContainerStyle: {
    paddingHorizontal: 0,
    marginRight: 16,
  },
} as const;

const styles = StyleSheet.create({
  iconButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  textButton: {
    minHeight: 48,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.38,
  },
});
