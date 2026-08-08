import { Stack, useRouter } from 'expo-router';
import { Pressable } from 'react-native';
import { Icon, useTheme } from '@/shared/design-system';

export default function SettingsLayout() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.onSurface,
        contentStyle: { backgroundColor: colors.background },
        headerLeft: ({ canGoBack, tintColor }) =>
          canGoBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back"
              onPress={() => router.back()}
              hitSlop={8}
              style={{ padding: 4 }}
            >
              <Icon name="arrow-back" size={22} color={tintColor} />
            </Pressable>
          ) : null,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Settings' }} />
      <Stack.Screen name="business" options={{ title: 'Business details' }} />
      <Stack.Screen name="branding" options={{ title: 'Logo & signature' }} />
      <Stack.Screen name="signature" options={{ title: 'Draw signature' }} />
      <Stack.Screen name="bank" options={{ title: 'Bank & payments' }} />
      <Stack.Screen
        name="preferences"
        options={{ title: 'Currency & formats' }}
      />
      <Stack.Screen
        name="invoice-defaults"
        options={{ title: 'Invoice defaults' }}
      />
      <Stack.Screen
        name="invoice-template"
        options={{ title: 'Invoice templates' }}
      />
      <Stack.Screen
        name="invoice-template-edit"
        options={{ title: 'Edit template' }}
      />
      <Stack.Screen name="subscription" options={{ title: 'Subscription' }} />
      <Stack.Screen name="appearance" options={{ title: 'Appearance' }} />
      <Stack.Screen name="legal" options={{ title: 'Legal' }} />
    </Stack>
  );
}
