import { useState } from 'react';
import { router, Tabs } from 'expo-router';
import { View } from 'react-native';
import { MoreCreateSheet } from '@/features/invoices/components/MoreCreateSheet';
import { useTheme } from '@/shared/design-system';
import { FloatingTabBar } from '@/shared/ui';

const CREATE_PATH: Record<string, '/invoice/new' | '/catalogue/new' | '/clients/new'> =
  {
    index: '/invoice/new',
    catalogue: '/catalogue/new',
    clients: '/clients/new',
  };

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
        <Tabs.Screen name="index" options={{ title: 'Invoices' }} />
        <Tabs.Screen name="catalogue" options={{ title: 'Catalogue' }} />
        <Tabs.Screen name="clients" options={{ title: 'Clients' }} />
        <Tabs.Screen name="reports" options={{ title: 'Reports' }} />
        <Tabs.Screen name="tools" options={{ title: 'Settings' }} />
      </Tabs>
      <MoreCreateSheet visible={moreOpen} onClose={() => setMoreOpen(false)} />
    </View>
  );
}
