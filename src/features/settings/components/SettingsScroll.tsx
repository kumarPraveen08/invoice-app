import { useCallback, useMemo, useRef, type ReactElement, type ReactNode } from 'react';
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type SectionListProps,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { LegendList } from '@legendapp/list/react-native';
import { SectionList } from '@legendapp/list/section-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen, Text, useTheme } from '@/shared/design-system';
import { useTabBarVisibility } from '@/shared/ui/tabBarVisibility';

type PadProps = {
  withTabBar?: boolean;
  includeTopInset?: boolean;
};

const SCROLL_DELTA = 8;

function useListChrome({
  withTabBar = false,
  includeTopInset = false,
}: PadProps) {
  const { space, layout, colors, radii } = useTheme();
  const insets = useSafeAreaInsets();
  const setHidden = useTabBarVisibility((s) => s.setHidden);
  const lastY = useRef(0);

  const paddingBottom = withTabBar
    ? layout.tabBar.height +
      layout.fab.size +
      Math.max(insets.bottom, layout.tabBar.marginBottom) +
      space.lg
    : Math.max(insets.bottom, space.lg) + space['2xl'];

  const contentPadding = {
    paddingHorizontal: space.lg,
    paddingTop: (includeTopInset ? insets.top : 0) + space.lg,
    paddingBottom,
  };

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
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
    },
    [setHidden, withTabBar],
  );

  return {
    space,
    colors,
    radii,
    contentPadding,
    onScroll: withTabBar ? onScroll : undefined,
  };
}

type Props = {
  children: ReactNode;
  withTabBar?: boolean;
  /** Use when the screen has no nav header (e.g. full-screen search). */
  includeTopInset?: boolean;
};

export function SettingsScroll({
  children,
  withTabBar = false,
  includeTopInset = false,
}: Props) {
  const { contentPadding, onScroll } = useListChrome({
    withTabBar,
    includeTopInset,
  });

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={[styles.content, contentPadding]}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        {children}
      </ScrollView>
    </Screen>
  );
}

type Section<T> = {
  title: string;
  data: T[];
};

type SettingsSectionListProps<T> = PadProps & {
  sections: Section<T>[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number, section: Section<T>) => ReactElement;
  ListHeaderComponent?: SectionListProps<T>['ListHeaderComponent'];
  ListEmptyComponent?: SectionListProps<T>['ListEmptyComponent'];
};

/** LegendList SectionList — virtualized, recycled. */
export function SettingsSectionList<T>({
  sections,
  keyExtractor,
  renderItem,
  ListHeaderComponent,
  ListEmptyComponent,
  withTabBar = false,
  includeTopInset = false,
}: SettingsSectionListProps<T>) {
  const { space, colors, radii, contentPadding, onScroll } = useListChrome({
    withTabBar,
    includeTopInset,
  });

  return (
    <Screen>
      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        recycleItems
        stickySectionHeadersEnabled={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={onScroll}
        contentContainerStyle={[styles.content, contentPadding]}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        renderSectionHeader={({ section }) => (
          <Text
            variant="caption"
            muted
            style={{
              marginBottom: space.sm,
              marginLeft: space.md,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              fontWeight: '600',
            }}
          >
            {section.title}
          </Text>
        )}
        renderItem={({ item, index, section }) => {
          const last = index === section.data.length - 1;
          const first = index === 0;
          return (
            <View
              style={{
                backgroundColor: colors.surface,
                borderTopLeftRadius: first ? radii.xl : 0,
                borderTopRightRadius: first ? radii.xl : 0,
                borderBottomLeftRadius: last ? radii.xl : 0,
                borderBottomRightRadius: last ? radii.xl : 0,
                marginBottom: last ? space['2xl'] : 0,
                overflow: 'hidden',
              }}
            >
              {renderItem(item, index, section)}
            </View>
          );
        }}
      />
    </Screen>
  );
}

type SettingsFlatListProps<T> = PadProps & {
  data: T[];
  keyExtractor: (item: T) => string;
  renderItem: (item: T, index: number) => ReactElement;
  title?: string;
  ListHeaderComponent?: ReactElement | null;
  ListEmptyComponent?: ReactElement | null;
};

/** LegendList FlatList — virtualized, recycled, optional card group title. */
export function SettingsFlatList<T>({
  data,
  keyExtractor,
  renderItem,
  title,
  ListHeaderComponent,
  ListEmptyComponent,
  withTabBar = false,
  includeTopInset = false,
}: SettingsFlatListProps<T>) {
  const { space, colors, radii, contentPadding, onScroll } = useListChrome({
    withTabBar,
    includeTopInset,
  });

  const header = useMemo(() => {
    if (!ListHeaderComponent && !title) return null;
    return (
      <View>
        {ListHeaderComponent}
        {title && data.length > 0 ? (
          <Text
            variant="caption"
            muted
            style={{
              marginBottom: space.sm,
              marginLeft: space.md,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              fontWeight: '600',
            }}
          >
            {title}
          </Text>
        ) : null}
      </View>
    );
  }, [ListHeaderComponent, title, data.length, space]);

  return (
    <Screen>
      <LegendList
        data={data}
        keyExtractor={keyExtractor}
        recycleItems
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={onScroll}
        contentContainerStyle={[styles.content, contentPadding]}
        ListHeaderComponent={header}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={({ item, index }) => {
          const last = index === data.length - 1;
          const first = index === 0;
          return (
            <View
              style={{
                backgroundColor: colors.surface,
                borderTopLeftRadius: first ? radii.xl : 0,
                borderTopRightRadius: first ? radii.xl : 0,
                borderBottomLeftRadius: last ? radii.xl : 0,
                borderBottomRightRadius: last ? radii.xl : 0,
                marginBottom: last ? space['2xl'] : 0,
                overflow: 'hidden',
              }}
            >
              {renderItem(item, index)}
            </View>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
});
