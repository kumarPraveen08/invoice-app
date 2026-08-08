import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '@/shared/design-system';
import { useSettingsStore } from '@/features/settings/store';
import { SnackbarHost } from '@/shared/ui';
import { AuthProvider, useAuth } from '@/features/auth';

WebBrowser.maybeCompleteAuthSession();
void SplashScreen.preventAutoHideAsync().catch(() => undefined);

function RootNavigator() {
  const { colors, mode } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const onboardingComplete = useSettingsStore((s) => s.onboardingComplete);
  const authSkipped = useSettingsStore((s) => s.authSkipped);
  const { session, loading: authLoading } = useAuth();
  const [hydrated, setHydrated] = useState(() => useSettingsStore.persist.hasHydrated());

  useEffect(() => {
    const unsub = useSettingsStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });

    if (useSettingsStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return unsub;
  }, []);

  const ready = hydrated && !authLoading;

  useEffect(() => {
    if (!ready) return;
    void SplashScreen.hideAsync().catch(() => undefined);
  }, [ready]);

  useEffect(() => {
    if (!ready) return;

    const inOnboarding = segments[0] === 'onboarding';
    const inAuth = segments[0] === 'auth';
    const signedIn = Boolean(session) || authSkipped;

    if (!onboardingComplete) {
      if (!inOnboarding) {
        router.replace('/onboarding');
      }
      return;
    }

    if (!signedIn) {
      if (!inAuth) {
        router.replace('/auth');
      }
      return;
    }

    if (inOnboarding || inAuth) {
      router.replace('/(tabs)');
    }
  }, [ready, onboardingComplete, session, authSkipped, router, segments]);

  const statusBarStyle = mode === 'dark' ? 'light-content' : 'dark-content';

  if (!ready) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.onSurface,
        }}
      >
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
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
          name="invoice/[id]"
          options={{
            title: 'Invoice',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
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
          name="catalogue/[id]"
          options={{
            title: 'Item',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
          }}
        />
        <Stack.Screen
          name="catalogue/import"
          options={{
            title: 'Bulk import',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
          }}
        />
        <Stack.Screen
          name="catalogue/search"
          options={{
            headerShown: false,
            animation: 'fade',
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
        <Stack.Screen
          name="clients/[id]"
          options={{
            title: 'Client',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
          }}
        />
        <Stack.Screen
          name="clients/import"
          options={{
            title: 'Bulk import',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: colors.background },
          }}
        />
        <Stack.Screen
          name="clients/search"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
      </Stack>
      <StatusBar animated backgroundColor={colors.background} barStyle={statusBarStyle} />
      <SnackbarHost />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
