import { Tabs } from 'expo-router';
import { useColorScheme, View } from 'react-native';
import { colors } from '@/shared/constants';
import { FloatingTabBar } from '@/shared/ui';

export default function TabsLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const theme = colors[scheme];

  return (
    <View style={{ flex: 1, backgroundColor: theme.screenBg }}>
      <Tabs
        tabBar={(props) => <FloatingTabBar {...props} />}
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.screenBg },
          headerTintColor: theme.text,
          sceneStyle: { backgroundColor: theme.screenBg },
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Invoices' }} />
        <Tabs.Screen name="estimates" options={{ title: 'Estimates' }} />
        <Tabs.Screen name="clients" options={{ title: 'Clients' }} />
        <Tabs.Screen name="reports" options={{ title: 'Reports' }} />
        <Tabs.Screen name="tools" options={{ title: 'Tools' }} />
      </Tabs>
    </View>
  );
}
