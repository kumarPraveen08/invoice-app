import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { applyElevation, useTheme } from '@/shared/design-system';
import type { TabName } from './TabBarIcon';

type FloatingTabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>['tabBar']>
>[0] & {
  onFabPress?: (routeName: string) => void;
};

const ROUTE_TAB: Record<string, TabName> = {
  index: 'invoices',
  catalogue: 'catalogue',
  clients: 'clients',
  reports: 'reports',
  tools: 'tools',
};

const ICONS: Record<
  TabName,
  { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }
> = {
  invoices: { active: 'receipt', inactive: 'receipt-outline' },
  catalogue: { active: 'grid', inactive: 'grid-outline' },
  clients: { active: 'people', inactive: 'people-outline' },
  reports: { active: 'bar-chart', inactive: 'bar-chart-outline' },
  tools: { active: 'settings', inactive: 'settings-outline' },
};

const CREATE_ROUTES = new Set(['index', 'catalogue', 'clients']);

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
  onFabPress,
}: FloatingTabBarProps) {
  const { colors, layout, radii } = useTheme();
  const { tabBar, fab } = layout;
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;
  const rowBottom = Math.max(bottomInset, tabBar.marginBottom) + 5;
  const activeRoute = state.routes[state.index]?.name ?? 'index';
  const showCreate = CREATE_ROUTES.has(activeRoute);
  const fabIcon = showCreate ? 'add' : 'ellipsis-horizontal';
  const fabLabel = showCreate ? 'Create' : 'More actions';

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        {
          paddingBottom: bottomInset,
          paddingHorizontal: tabBar.marginHorizontal,
          backgroundColor: colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.row,
          {
            marginBottom: rowBottom - bottomInset,
            gap: tabBar.addGap,
          },
        ]}
      >
        <View
          style={[
            styles.capsule,
            {
              height: tabBar.height,
              backgroundColor: colors.tabBar,
              borderRadius: radii.full,
            },
            applyElevation('md', colors.shadow),
          ]}
        >
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const { options } = descriptors[route.key];
            const label =
              typeof options.tabBarLabel === 'string'
                ? options.tabBarLabel
                : typeof options.title === 'string'
                  ? options.title
                  : route.name;
            const tabName = ROUTE_TAB[route.name] ?? 'invoices';
            const icon = ICONS[tabName];

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                onPress={onPress}
                style={styles.item}
              >
                <View
                  style={[
                    styles.iconSlot,
                    focused && {
                      backgroundColor: colors.iconSoft,
                      borderRadius: radii.full,
                    },
                  ]}
                >
                  <Ionicons
                    name={focused ? icon.active : icon.inactive}
                    size={tabBar.iconSize}
                    color={focused ? colors.primary : colors.tabInactive}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>

        {onFabPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={fabLabel}
            onPress={() => onFabPress(activeRoute)}
            style={({ pressed }) => [
              styles.add,
              {
                width: fab.size,
                height: fab.size,
                borderRadius: radii.lg,
                backgroundColor: colors.primary,
                opacity: pressed ? 0.88 : 1,
              },
              applyElevation('md', colors.shadow),
            ]}
          >
            <Ionicons
              name={fabIcon}
              size={fab.iconSize}
              color={colors.onPrimary}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capsule: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  iconSlot: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
