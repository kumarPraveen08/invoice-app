import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton, useTheme } from '@/shared/design-system';

type Props = {
  onPress: () => void;
  accessibilityLabel?: string;
};

export function FloatingAddButton({
  onPress,
  accessibilityLabel = 'Add',
}: Props) {
  const { layout } = useTheme();
  const { tabBar, fab } = layout;
  const insets = useSafeAreaInsets();
  const tabBarBottom = Math.max(insets.bottom, tabBar.marginBottom) + 5;
  const bottom = tabBarBottom + tabBar.height + fab.gapAboveTabBar;

  return (
    <IconButton
      icon="add"
      size="fab"
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={[styles.fab, { bottom, right: fab.marginRight }]}
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
  },
});
