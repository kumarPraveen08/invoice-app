import { View, type ViewProps } from 'react-native';
import { useTheme } from '../useTheme';

type Props = ViewProps;

export function Screen({ style, ...props }: Props) {
  const { colors } = useTheme();

  return (
    <View
      {...props}
      style={[{ flex: 1, backgroundColor: colors.background }, style]}
    />
  );
}
