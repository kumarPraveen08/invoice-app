import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';
import { MoreCreateSheet } from '@/features/invoices/components/MoreCreateSheet';
import { useTheme } from '@/shared/design-system';
import { FloatingTabBar } from '@/shared/ui';

const CREATE_PATH: Record<string, '/invoice/new' | '/catalogue/new' | '/clients/new'> =
  {
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
  const [moreOpen, setMoreOpen] = useState(false);

  const onFabPress = (routeName: string) => {
    const path = CREATE_PATH[routeName];
    if (path) {
      router.push(path);
      return;
    }
    setMoreOpen(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        tabBar={(props) => (
          <FloatingTabBar {...props} onFabPress={onFabPress} />
        )}
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
              <View style={{ marginRight: 12 }}>
                <HeaderIcon
                  icon="search"
                  label="Search invoices"
                  onPress={() => router.push('/invoice/search')}
                />
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
                  icon="cloud-upload-outline"
                  label="Bulk import catalogue"
                  onPress={() => router.push('/catalogue/import')}
                />
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
                  icon="people-outline"
                  label="Add from contacts"
                  onPress={() =>
                    router.push({
                      pathname: '/clients/new',
                      params: { from: 'contacts' },
                    })
                  }
                />
                <HeaderIcon
                  icon="cloud-upload-outline"
                  label="Bulk import clients"
                  onPress={() => router.push('/clients/import')}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen name="reports" options={{ title: 'Reports' }} />
        <Tabs.Screen name="tools" options={{ title: 'Settings' }} />
      </Tabs>
      <MoreCreateSheet visible={moreOpen} onClose={() => setMoreOpen(false)} />
    </View>
  );
}
