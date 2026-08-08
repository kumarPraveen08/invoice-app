import { Stack, useRouter } from "expo-router";
import { useTheme } from "@/shared/design-system";
import {
  DeferredMount,
  HeaderIconButton,
  stackHeaderIconContainerStyle,
} from "@/shared/ui";

export default function SettingsLayout() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Stack
      screenLayout={({ children }) => <DeferredMount>{children}</DeferredMount>}
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.onSurface,
        contentStyle: { backgroundColor: colors.background },
        ...stackHeaderIconContainerStyle,
        headerLeft: ({ canGoBack, tintColor }) =>
          canGoBack ? (
            <HeaderIconButton
              name="arrow-back"
              label="Back"
              onPress={() => router.back()}
              color={tintColor ?? colors.onSurface}
            />
          ) : null,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Settings" }} />
      <Stack.Screen name="business" options={{ title: "Business details" }} />
      <Stack.Screen name="branding" options={{ title: "Logo & signature" }} />
      <Stack.Screen name="signature" options={{ title: "Draw signature" }} />
      <Stack.Screen name="bank" options={{ title: "Bank & payments" }} />
      <Stack.Screen
        name="preferences"
        options={{ title: "Currency & formats" }}
      />
      <Stack.Screen
        name="invoice-defaults"
        options={{ title: "Invoice defaults" }}
      />
      <Stack.Screen
        name="invoice-template"
        options={{ title: "Invoice templates" }}
      />
      <Stack.Screen
        name="invoice-template-edit"
        options={{ title: "Edit template" }}
      />
      <Stack.Screen name="subscription" options={{ title: "Subscription" }} />
      <Stack.Screen name="appearance" options={{ title: "Appearance" }} />
      <Stack.Screen name="legal" options={{ title: "Legal" }} />
    </Stack>
  );
}
