import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, useTheme } from '@/shared/design-system';

type Props = {
  children: ReactNode;
  withTabBar?: boolean;
};

export function SettingsScroll({ children, withTabBar = false }: Props) {
  const { space, layout } = useTheme();
  const insets = useSafeAreaInsets();
  const tabPad = withTabBar
    ? layout.tabBar.height +
      layout.fab.size +
      Math.max(insets.bottom, layout.tabBar.marginBottom) +
      space.lg
    : Math.max(insets.bottom, space.lg) + space['2xl'];

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: space.lg,
            paddingTop: space.lg,
            paddingBottom: tabPad,
          },
        ]}
        keyboardShouldPersistTaps="handled"
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
