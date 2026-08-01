import { NavigationBar } from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "@/shared/design-system";

function RootNavigator() {
  const { colors, mode } = useTheme();
  const statusBarStyle = mode === "dark" ? "light-content" : "dark-content";
  const navigationBarStyle = mode === "dark" ? "light" : "dark";

  return (
    <>
      <NavigationBar style={navigationBarStyle} />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.onSurface,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen
          name="invoice/new"
          options={{
            title: 'New invoice',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
          }}
        />
        <Stack.Screen
          name="invoice/search"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="catalogue/new"
          options={{
            title: 'New catalogue item',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
          }}
        />
        <Stack.Screen
          name="clients/new"
          options={{
            title: 'New client',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
          }}
        />
      </Stack>
      <StatusBar
        animated
        backgroundColor={colors.background}
        barStyle={statusBarStyle}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
