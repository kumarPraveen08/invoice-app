import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import type { ComponentProps } from 'react';
import type { ColorValue, StyleProp, TextStyle } from 'react-native';

/** Material Icons (Material 3 / Google Icons set). */
export type IconName = ComponentProps<typeof MaterialIcons>['name'];

type Props = {
  name: IconName;
  size?: number;
  color?: ColorValue;
  style?: StyleProp<TextStyle>;
};

/** App-wide icon — Material Icons, M3-recommended glyph set. */
export function Icon({ name, size = 24, color, style }: Props) {
  return <MaterialIcons name={name} size={size} color={color} style={style} />;
}
