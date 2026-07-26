import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, tabBar } from '@/shared/constants';
import type { TabName } from './TabBarIcon';

type FloatingTabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>['tabBar']>
>[0];

const ROUTE_TAB: Record<string, TabName> = {
  index: 'invoices',
  estimates: 'estimates',
  clients: 'clients',
  reports: 'reports',
  tools: 'tools',
};

const ICONS: Record<
  TabName,
  { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }
> = {
  invoices: { active: 'receipt', inactive: 'receipt-outline' },
  estimates: { active: 'document-text', inactive: 'document-text-outline' },
  clients: { active: 'people', inactive: 'people-outline' },
  reports: { active: 'bar-chart', inactive: 'bar-chart-outline' },
  tools: { active: 'build', inactive: 'build-outline' },
};

export function FloatingTabBar({ state, descriptors, navigation }: FloatingTabBarProps) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = colors[scheme];
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, tabBar.marginBottom) + 5;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { bottom, paddingHorizontal: tabBar.marginHorizontal }]}
    >
      <View
        style={[
          styles.capsule,
          {
            height: tabBar.height,
            backgroundColor: theme.tabBarBg,
            borderRadius: tabBar.borderRadius,
            shadowColor: theme.shadow,
          },
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
              {focused ? (
                <View
                  style={[
                    styles.pill,
                    {
                      backgroundColor: theme.primary,
                      paddingHorizontal: tabBar.pillPaddingH,
                      paddingVertical: tabBar.pillPaddingV,
                    },
                  ]}
                >
                  <Ionicons
                    name={icon.active}
                    size={tabBar.iconSize}
                    color={theme.primaryContrast}
                  />
                  <Text
                    style={[
                      styles.label,
                      { color: theme.primaryContrast, fontSize: tabBar.labelSize },
                    ]}
                    numberOfLines={1}
                  >
                    {label}
                  </Text>
                </View>
              ) : (
                <Ionicons
                  name={icon.inactive}
                  size={tabBar.iconSize}
                  color={theme.tabInactive}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    elevation: tabBar.elevation,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
  },
  label: {
    fontWeight: '600',
  },
});
