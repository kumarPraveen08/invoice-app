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

function HeaderImportButton({
  href,
  label,
}: {
  href: '/catalogue/import' | '/clients/import';
  label: string;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => router.push(href)}
      hitSlop={8}
      style={{ marginRight: 16, padding: 4 }}
    >
      <Ionicons name="cloud-upload-outline" size={22} color={colors.onSurface} />
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
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Search invoices"
                onPress={() => router.push('/invoice/search')}
                hitSlop={8}
                style={{ marginRight: 16, padding: 4 }}
              >
                <Ionicons name="search" size={22} color={colors.onSurface} />
              </Pressable>
            ),
          }}
        />
        <Tabs.Screen
          name="catalogue"
          options={{
            title: 'Catalogue',
            headerRight: () => (
              <HeaderImportButton
                href="/catalogue/import"
                label="Bulk import catalogue"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="clients"
          options={{
            title: 'Clients',
            headerRight: () => (
              <HeaderImportButton
                href="/clients/import"
                label="Bulk import clients"
              />
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
