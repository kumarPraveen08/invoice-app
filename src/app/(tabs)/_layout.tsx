import { Tabs } from "expo-router";
import { View } from "react-native";
import { useTheme } from "@/shared/design-system";
import { FloatingTabBar } from "@/shared/ui";

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        tabBar={(props) => <FloatingTabBar {...props} />}
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.onSurface,
          sceneStyle: { backgroundColor: colors.background },
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Invoices" }} />
        <Tabs.Screen name="estimates" options={{ title: "Estimates" }} />
        <Tabs.Screen name="clients" options={{ title: "Clients" }} />
        <Tabs.Screen name="reports" options={{ title: "Reports" }} />
        <Tabs.Screen name="tools" options={{ title: "Tools" }} />
      </Tabs>
    </View>
  );
}
