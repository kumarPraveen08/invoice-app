import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { applyElevation } from '../tokens';
import { useTheme } from '../useTheme';
import { Icon, type IconName } from './Icon';

type IconButtonSize = 'default' | 'fab';

type Props = Omit<PressableProps, 'style'> & {
  icon: IconName;
  size?: IconButtonSize;
  style?: StyleProp<ViewStyle>;
};

export function IconButton({
  icon,
  size = 'default',
  style,
  ...props
}: Props) {
  const { colors, layout, radii } = useTheme();
  const isFab = size === 'fab';
  const dimension = isFab ? layout.fab.size : 44;
  const iconSize = isFab ? layout.fab.iconSize : 22;

  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      style={({ pressed }) => [
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primary,
          opacity: pressed ? 0.88 : 1,
        },
        applyElevation(isFab ? 'md' : 'sm', colors.shadow),
        style,
      ]}
    >
      <Icon name={icon} size={iconSize} color={colors.onPrimary} />
    </Pressable>
  );
}
