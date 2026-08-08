import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { ComponentProps } from "react";
import type { ColorValue, StyleProp, TextStyle } from "react-native";

/**
 * App icon keys — MaterialIcons glyph names.
 * Compose Material Symbols stay in tab-bar Hosts only (no Host-per-icon).
 */
const ICONS = {
  "account-balance-wallet": true,
  add: true,
  "add-circle": true,
  analytics: true,
  "arrow-back": true,
  "attach-file": true,
  "bar-chart": true,
  block: true,
  business: true,
  calculate: true,
  "calendar-today": true,
  cancel: true,
  check: true,
  "check-box": true,
  "check-box-outline-blank": true,
  "check-circle-outline": true,
  "chevron-right": true,
  close: true,
  "credit-card": true,
  delete: true,
  description: true,
  diamond: true,
  download: true,
  drafts: true,
  edit: true,
  "error-outline": true,
  "expand-less": true,
  "expand-more": true,
  flag: true,
  "folder-open": true,
  "grid-view": true,
  info: true,
  "inventory-2": true,
  list: true,
  "local-offer": true,
  logout: true,
  mail: true,
  "menu-book": true,
  "more-horiz": true,
  newspaper: true,
  palette: true,
  payments: true,
  people: true,
  "people-outline": true,
  person: true,
  "person-add": true,
  "pie-chart": true,
  receipt: true,
  "receipt-long": true,
  redo: true,
  repeat: true,
  reply: true,
  "rocket-launch": true,
  schedule: true,
  search: true,
  send: true,
  settings: true,
  share: true,
  "shopping-cart": true,
  "star-border": true,
  "text-fields": true,
  tune: true,
  undo: true,
  "verified-user": true,
  visibility: true,
  "water-drop": true,
} as const;

export type IconName = keyof typeof ICONS;

type Props = {
  name: IconName;
  size?: number;
  color?: ColorValue;
  style?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
};

/** App-wide icon — font glyphs (fast; safe inside RN Pressables). */
export function Icon({
  name,
  size = 24,
  color,
  style,
  accessibilityLabel,
}: Props) {
  return (
    <MaterialIcons
      name={name as ComponentProps<typeof MaterialIcons>["name"]}
      size={size}
      color={color}
      style={style}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
