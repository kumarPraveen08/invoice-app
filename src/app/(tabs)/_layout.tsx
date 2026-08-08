import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Tabs } from 'expo-router';
import { Alert, Pressable, View } from 'react-native';
import { MoreCreateSheet } from '@/features/invoices/components/MoreCreateSheet';
import { useTheme } from '@/shared/design-system';
import { FloatingTabBar } from '@/shared/ui';
import { useAuth } from '@/features/auth';

const CREATE_PATH: Record<string, '/invoice/new' | '/catalogue/new' | '/clients/new'> = {
  index: '/invoice/new',
  catalogue: '/catalogue/new',
  clients: '/clients/new',
};

function HeaderIcon({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={8}
      style={{ padding: 4 }}
    >
      <Ionicons name={icon} size={22} color={colors.onSurface} />
    </Pressable>
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const { signOut } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);

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
                <HeaderIcon
                  icon="search"
                  label="Search invoices"
                  onPress={() => router.push('/invoice/search')}
                />
                <HeaderIcon icon="log-out-outline" label="Sign out" onPress={() => void onSignOut()} />
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
                <HeaderIcon
                  icon="search"
                  label="Search catalogue"
                  onPress={() => router.push('/catalogue/search')}
                />
                <HeaderIcon
                  icon="file-tray-full-outline"
                  label="Bulk import catalogue"
                  onPress={() => router.push('/catalogue/import')}
                />
                <HeaderIcon icon="log-out-outline" label="Sign out" onPress={() => void onSignOut()} />
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
                <HeaderIcon
                  icon="search"
                  label="Search clients"
                  onPress={() => router.push('/clients/search')}
                />
                <HeaderIcon
                  icon="person-add-outline"
                  label="Add from contacts"
                  onPress={() =>
                    router.push({
                      pathname: '/clients/new',
                      params: { from: 'contacts' },
                    })
                  }
                />
                <HeaderIcon
                  icon="file-tray-full-outline"
                  label="Bulk import clients"
                  onPress={() => router.push('/clients/import')}
                />
                <HeaderIcon icon="log-out-outline" label="Sign out" onPress={() => void onSignOut()} />
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
                <HeaderIcon icon="log-out-outline" label="Sign out" onPress={() => void onSignOut()} />
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
                <HeaderIcon icon="log-out-outline" label="Sign out" onPress={() => void onSignOut()} />
              </View>
            ),
          }}
        />
      </Tabs>
      <MoreCreateSheet visible={moreOpen} onClose={() => setMoreOpen(false)} />
    </View>
  );
}
