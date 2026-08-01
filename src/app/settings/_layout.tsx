import { Stack } from 'expo-router';
import { useTheme } from '@/shared/design-system';

export default function SettingsLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.onSurface,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
      <Stack.Screen name="business" options={{ title: 'Business details' }} />
      <Stack.Screen name="branding" options={{ title: 'Logo & signature' }} />
      <Stack.Screen name="bank" options={{ title: 'Bank & payments' }} />
      <Stack.Screen
        name="preferences"
        options={{ title: 'Currency & formats' }}
      />
      <Stack.Screen
        name="invoice-defaults"
        options={{ title: 'Invoice defaults' }}
      />
    </Stack>
  );
}
