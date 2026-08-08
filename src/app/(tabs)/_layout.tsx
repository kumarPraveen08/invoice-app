import { useState } from 'react';
import { router, Tabs } from 'expo-router';
import { Alert, Pressable, View } from 'react-native';
import { MoreCreateSheet } from '@/features/invoices/components/MoreCreateSheet';
import { Icon, useTheme, type IconName } from '@/shared/design-system';
import { FloatingTabBar } from '@/shared/ui';
import { useAuth } from '@/features/auth';

const CREATE_PATH: Record<string, '/invoice/new' | '/catalogue/new' | '/clients/new'> = {
  index: '/invoice/new',
  catalogue: '/catalogue/new',
  clients: '/clients/new',
};

function headerIcon(
  name: IconName,
  label: string,
  onPress: () => void,
  color: string,
) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={{ padding: 4 }}
    >
      <Icon name={name} size={22} color={color} />
    </Pressable>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const { signOut } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);
  const iconColor = colors.onSurface;

  const onFabPress = (routeName: string) => {
    const path = CREATE_PATH[routeName];
    if (path) {
      router.push(path);
      return;
    }
    setMoreOpen(true);
  };

  const onSignOut = async () => {
    const error = await signOut();
    if (error) {
      Alert.alert('Sign out failed', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        tabBar={(props) => <FloatingTabBar {...props} onFabPress={onFabPress} />}
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.onSurface,
          sceneStyle: { backgroundColor: colors.background },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Invoices',
            headerRight: () => (
              <View style={{ marginRight: 12, flexDirection: 'row', gap: 8 }}>
                {headerIcon('search', 'Search invoices', () => router.push('/invoice/search'), iconColor)}
                {headerIcon('logout', 'Sign out', () => void onSignOut(), iconColor)}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="catalogue"
          options={{
            title: 'Catalogue',
            headerRight: () => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  marginRight: 12,
                }}
              >
                {headerIcon('search', 'Search catalogue', () => router.push('/catalogue/search'), iconColor)}
                {headerIcon('folder-open', 'Bulk import catalogue', () => router.push('/catalogue/import'), iconColor)}
                {headerIcon('logout', 'Sign out', () => void onSignOut(), iconColor)}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="clients"
          options={{
            title: 'Clients',
            headerRight: () => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  marginRight: 12,
                }}
              >
                {headerIcon('search', 'Search clients', () => router.push('/clients/search'), iconColor)}
                {headerIcon(
                  'person-add',
                  'Add from contacts',
                  () =>
                    router.push({
                      pathname: '/clients/new',
                      params: { from: 'contacts' },
                    }),
                  iconColor,
                )}
                {headerIcon('folder-open', 'Bulk import clients', () => router.push('/clients/import'), iconColor)}
                {headerIcon('logout', 'Sign out', () => void onSignOut(), iconColor)}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="reports"
          options={{
            title: 'Reports',
            headerRight: () => (
              <View style={{ marginRight: 12 }}>
                {headerIcon('logout', 'Sign out', () => void onSignOut(), iconColor)}
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="tools"
          options={{
            title: 'Settings',
            headerRight: () => (
              <View style={{ marginRight: 12 }}>
                {headerIcon('logout', 'Sign out', () => void onSignOut(), iconColor)}
              </View>
            ),
          }}
        />
      </Tabs>
      <MoreCreateSheet visible={moreOpen} onClose={() => setMoreOpen(false)} />
    </View>
  );
}
