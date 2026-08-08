import { router, Tabs } from 'expo-router';
import { useEffect, useRef, useState, type ComponentProps } from 'react';
import {
  DropdownMenu,
  DropdownMenuItem,
  FloatingActionButton,
  Host,
  HorizontalFloatingToolbar,
  Icon as ComposeIcon,
  IconButton,
  Row,
  Text as ComposeText,
} from '@expo/ui/jetpack-compose';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Add from '@expo/material-symbols/add.xml';
import BarChart from '@expo/material-symbols/bar_chart.xml';
import GridView from '@expo/material-symbols/grid_view.xml';
import Group from '@expo/material-symbols/group.xml';
import MoreHoriz from '@expo/material-symbols/more_horiz.xml';
import PersonAdd from '@expo/material-symbols/person_add.xml';
import Receipt from '@expo/material-symbols/receipt.xml';
import Settings from '@expo/material-symbols/settings.xml';
import { applyElevation, useTheme } from '@/shared/design-system';
import { useTabBarVisibility } from './tabBarVisibility';
import type { TabName } from './TabBarIcon';

type FloatingTabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>['tabBar']>
>[0] & {
  /** Create-tab FAB. More actions use Compose `DropdownMenu` on Android. */
  onFabPress?: (routeName: string) => void;
  /** iOS fallback when more FAB is pressed. */
  onMorePress?: () => void;
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

type MenuAction = {
  key: string;
  label: string;
  icon: IconSource;
  onPress?: () => void;
};

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
  onFabPress,
  onMorePress,
}: FloatingTabBarProps) {
  const { colors, layout, radii } = useTheme();
  const { tabBar, fab } = layout;
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;
  const rowBottom = Math.max(bottomInset, tabBar.marginBottom) + 5;
  const activeRoute = state.routes[state.index]?.name ?? 'index';
  const showCreate = CREATE_ROUTES.has(activeRoute);
  const fabLabel = showCreate ? 'Create' : 'More actions';
  const [menuOpen, setMenuOpen] = useState(false);
  const hidden = useTabBarVisibility((s) => s.hidden);
  const showTabBar = useTabBarVisibility((s) => s.show);
  const setPresent = useTabBarVisibility((s) => s.setPresent);
  const slide = useRef(new Animated.Value(0)).current;
  const hideDistance =
    tabBar.height + fab.size + Math.max(bottomInset, tabBar.marginBottom) + 24;

  useEffect(() => {
    setPresent(true);
    return () => setPresent(false);
  }, [setPresent]);

  useEffect(() => {
    showTabBar();
    setMenuOpen(false);
  }, [state.index, showTabBar]);

  useEffect(() => {
    Animated.timing(slide, {
      toValue: hidden ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [hidden, slide]);

  const translateY = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, hideDistance],
  });

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

  const closeMenu = () => setMenuOpen(false);

  const menuActions: MenuAction[] = [
    {
      key: 'invoice',
      label: 'Invoice',
      icon: Receipt,
      onPress: () => router.push('/invoice/new'),
    },
    {
      key: 'catalogue',
      label: 'Catalogue item',
      icon: GridView,
      onPress: () => router.push('/catalogue/new'),
    },
    {
      key: 'client',
      label: 'Client',
      icon: PersonAdd,
      onPress: () => router.push('/clients/new'),
    },
    {
      key: 'contacts',
      label: 'Client from contacts',
      icon: Group,
      onPress: () =>
        router.push({ pathname: '/clients/new', params: { from: 'contacts' } }),
    },
  ];

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
        <Animated.View
          pointerEvents={hidden ? 'none' : 'box-none'}
          style={{
            marginBottom: rowBottom - bottomInset,
            transform: [{ translateY }],
          }}
        >
          <Host matchContents>
            {/*
              DropdownMenu must wrap only the FAB — Compose anchors the popup to that
              Box. Wrapping the whole toolbar pins the menu to the toolbar's left edge.
            */}
            <Row
              verticalAlignment="center"
              horizontalArrangement={{ spacedBy: 8 }}
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
                      onClick={() => {
                        closeMenu();
                        onTabPress(route, focused);
                      }}
                      colors={{
                        contentColor: focused
                          ? colors.primary
                          : colors.tabInactive,
                        containerColor: focused ? colors.iconSoft : undefined,
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
              </HorizontalFloatingToolbar>

              <DropdownMenu
                expanded={!showCreate && menuOpen}
                onDismissRequest={closeMenu}
                color={colors.surface}
                cornerRadius={radii.lg}
              >
                <DropdownMenu.Trigger>
                  <FloatingActionButton
                    containerColor={colors.primary}
                    onClick={() =>
                      showCreate
                        ? onFabPress?.(activeRoute)
                        : setMenuOpen(true)
                    }
                  >
                    <FloatingActionButton.Icon>
                      <ComposeIcon
                        source={showCreate ? Add : MoreHoriz}
                        size={fab.iconSize}
                        tint={colors.onPrimary}
                        contentDescription={fabLabel}
                      />
                    </FloatingActionButton.Icon>
                  </FloatingActionButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Items>
                  {menuActions.map((action) => (
                    <DropdownMenuItem
                      key={action.key}
                      onClick={() => {
                        closeMenu();
                        action.onPress?.();
                      }}
                    >
                      <DropdownMenuItem.LeadingIcon>
                        <ComposeIcon source={action.icon} size={22} />
                      </DropdownMenuItem.LeadingIcon>
                      <DropdownMenuItem.Text>
                        <ComposeText>{action.label}</ComposeText>
                      </DropdownMenuItem.Text>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenu.Items>
              </DropdownMenu>
            </Row>
          </Host>
        </Animated.View>
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
      <Animated.View
        pointerEvents={hidden ? 'none' : 'box-none'}
        style={{
          transform: [{ translateY }],
        }}
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

          {onFabPress || onMorePress ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={fabLabel}
              onPress={() =>
                showCreate
                  ? onFabPress?.(activeRoute)
                  : onMorePress?.()
              }
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
      </Animated.View>
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
