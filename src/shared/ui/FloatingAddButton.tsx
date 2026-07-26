import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fab, tabBar } from '@/shared/constants';

type Props = {
  onPress: () => void;
  accessibilityLabel?: string;
};

export function FloatingAddButton({
  onPress,
  accessibilityLabel = 'Add',
}: Props) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = colors[scheme];
  const insets = useSafeAreaInsets();
  const tabBarBottom = Math.max(insets.bottom, tabBar.marginBottom) + 5;
  const bottom = tabBarBottom + tabBar.height + fab.gapAboveTabBar;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.button,
        {
          bottom,
          right: fab.marginRight,
          width: fab.size,
          height: fab.size,
          borderRadius: fab.size / 2,
          backgroundColor: theme.primary,
          shadowColor: theme.shadow,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      <Ionicons name="add" size={fab.iconSize} color={theme.primaryContrast} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
  },
});
