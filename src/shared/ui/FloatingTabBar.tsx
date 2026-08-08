import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import {
  Host,
  HorizontalFloatingToolbar,
  Icon as ComposeIcon,
  IconButton,
} from '@expo/ui/jetpack-compose';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Add from '@expo/material-symbols/add.xml';
import BarChart from '@expo/material-symbols/bar_chart.xml';
import GridView from '@expo/material-symbols/grid_view.xml';
import Group from '@expo/material-symbols/group.xml';
import MoreHoriz from '@expo/material-symbols/more_horiz.xml';
import Receipt from '@expo/material-symbols/receipt.xml';
import Settings from '@expo/material-symbols/settings.xml';
import { applyElevation, useTheme } from '@/shared/design-system';
import type { TabName } from './TabBarIcon';

type FloatingTabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>['tabBar']>
>[0] & {
  onFabPress?: (routeName: string) => void;
};

type IconSource = number;

const ROUTE_TAB: Record<string, TabName> = {
  index: 'invoices',
  catalogue: 'catalogue',
  clients: 'clients',
  reports: 'reports',
  tools: 'tools',
};

const ICONS: Record<TabName, IconSource> = {
  invoices: Receipt,
  catalogue: GridView,
  clients: Group,
  reports: BarChart,
  tools: Settings,
};

const FONT_ICONS: Record<TabName, ComponentProps<typeof MaterialIcons>['name']> =
  {
    invoices: 'receipt',
    catalogue: 'grid-view',
    clients: 'people',
    reports: 'bar-chart',
    tools: 'settings',
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
  const fabLabel = showCreate ? 'Create' : 'More actions';

  const onTabPress = (route: (typeof state.routes)[number], focused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (!focused && !event.defaultPrevented) {
      navigation.navigate(route.name, route.params);
    }
  };

  if (Platform.OS === 'android') {
    return (
      <View
        pointerEvents="box-none"
        style={[
          styles.wrap,
          {
            paddingBottom: bottomInset,
            paddingHorizontal: tabBar.marginHorizontal,
            alignItems: 'center',
          },
        ]}
      >
        {/* One Host; always IconButton — swapping button types drops toolbar slots. */}
        <Host
          matchContents
          style={{ marginBottom: rowBottom - bottomInset }}
        >
          <HorizontalFloatingToolbar
            variant="standard"
            colors={{
              toolbarContainerColor: colors.tabBar,
              toolbarContentColor: colors.tabInactive,
              fabContainerColor: colors.primary,
              fabContentColor: colors.onPrimary,
            }}
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

              return (
                <IconButton
                  key={route.name}
                  onClick={() => onTabPress(route, focused)}
                  colors={{
                    contentColor: focused ? colors.primary : colors.tabInactive,
                  }}
                >
                  <ComposeIcon
                    source={icon}
                    size={tabBar.iconSize}
                    tint={focused ? colors.primary : colors.tabInactive}
                    contentDescription={
                      options.tabBarAccessibilityLabel ?? label
                    }
                  />
                </IconButton>
              );
            })}
            {onFabPress ? (
              <HorizontalFloatingToolbar.FloatingActionButton
                onPress={() => onFabPress(activeRoute)}
              >
                <ComposeIcon
                  source={showCreate ? Add : MoreHoriz}
                  size={fab.iconSize}
                  contentDescription={fabLabel}
                />
              </HorizontalFloatingToolbar.FloatingActionButton>
            ) : null}
          </HorizontalFloatingToolbar>
        </Host>
      </View>
    );
  }

  const fabIcon: ComponentProps<typeof MaterialIcons>['name'] = showCreate
    ? 'add'
    : 'more-horiz';

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        {
          paddingBottom: bottomInset,
          paddingHorizontal: tabBar.marginHorizontal,
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
            const icon = FONT_ICONS[tabName];

            return (
              <Pressable
                key={route.name}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                onPress={() => onTabPress(route, focused)}
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
                  <MaterialIcons
                    name={icon}
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
            <MaterialIcons
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
