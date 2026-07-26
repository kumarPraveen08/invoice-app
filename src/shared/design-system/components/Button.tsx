import Ionicons from '@expo/vector-icons/Ionicons';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { applyElevation } from '../tokens';
import { useTheme } from '../useTheme';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type Props = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'primary',
  icon,
  style,
  ...props
}: Props) {
  const { colors, radii, space } = useTheme();

  const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: {
      backgroundColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.iconSoft,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
  };

  const labelColor =
    variant === 'primary'
      ? colors.onPrimary
      : variant === 'secondary'
        ? colors.primary
        : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: space.xs + 2,
          paddingHorizontal: space.xl,
          paddingVertical: space.md,
          borderRadius: radii.full,
          opacity: pressed ? 0.88 : 1,
        },
        variantStyles[variant],
        style,
      ]}
    >
      {icon ? (
        <Ionicons name={icon} size={18} color={labelColor} />
      ) : null}
      <Text variant="body" style={{ color: labelColor, fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );
}
