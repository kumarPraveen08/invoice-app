import { useRef, type ReactNode } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, useTheme } from '@/shared/design-system';
import { useTabBarVisibility } from '@/shared/ui/tabBarVisibility';

type Props = {
  children: ReactNode;
  withTabBar?: boolean;
  /** Use when the screen has no nav header (e.g. full-screen search). */
  includeTopInset?: boolean;
};

const SCROLL_DELTA = 8;

export function SettingsScroll({
  children,
  withTabBar = false,
  includeTopInset = false,
}: Props) {
  const { space, layout } = useTheme();
  const insets = useSafeAreaInsets();
  const setHidden = useTabBarVisibility((s) => s.setHidden);
  const lastY = useRef(0);
  const tabPad = withTabBar
    ? layout.tabBar.height +
      layout.fab.size +
      Math.max(insets.bottom, layout.tabBar.marginBottom) +
      space.lg
    : Math.max(insets.bottom, space.lg) + space['2xl'];

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!withTabBar) return;
    const y = event.nativeEvent.contentOffset.y;
    const dy = y - lastY.current;
    lastY.current = y;
    if (y < 24) {
      setHidden(false);
      return;
    }
    if (dy > SCROLL_DELTA) setHidden(true);
    else if (dy < -SCROLL_DELTA) setHidden(false);
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: space.lg,
            paddingTop: (includeTopInset ? insets.top : 0) + space.lg,
            paddingBottom: tabPad,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={withTabBar ? onScroll : undefined}
      >
        {children}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
});
