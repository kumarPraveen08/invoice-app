import {
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';
import { typography } from '../tokens';
import { useTheme } from '../useTheme';

type TextVariant = keyof typeof typography;

type Props = RNTextProps & {
  variant?: TextVariant;
  muted?: boolean;
};

export function Text({
  variant = 'body',
  muted = false,
  style,
  ...props
}: Props) {
  const { colors, typography: typeScale } = useTheme();
  const variantStyle = typeScale[variant];

  return (
    <RNText
      {...props}
      style={[
        variantStyle as TextStyle,
        { color: muted ? colors.onSurfaceMuted : colors.onSurface },
        style,
      ]}
    />
  );
}
