import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Screen, Text, useTheme } from '@/shared/design-system';

export function AuthWelcomeScreen() {
  const { colors, space } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Screen>
      <View
        style={[
          styles.flex,
          {
            paddingTop: insets.top + space.md,
            paddingHorizontal: space.lg,
          },
        ]}
      >
        <Text
          variant="caption"
          muted
          style={{ marginTop: space.xl, marginBottom: space.md, fontSize: 14 }}
        >
          Almost there
        </Text>
        <Text
          style={{
            color: colors.onSurface,
            fontSize: 34,
            lineHeight: 40,
            fontWeight: '800',
            letterSpacing: -0.8,
            marginBottom: space.sm,
          }}
        >
          Create your account
        </Text>
        <Text
          style={{
            color: colors.onSurfaceMuted,
            fontSize: 18,
            lineHeight: 26,
            fontWeight: '500',
          }}
        >
          Save invoices across devices and keep your business data secure.
        </Text>
      </View>

      <View
        style={{
          paddingHorizontal: space.lg,
          paddingBottom: Math.max(insets.bottom, space.lg),
          gap: space.sm,
        }}
      >
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/auth/signup')}
          style={({ pressed }) => [
            styles.cta,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Text style={[styles.ctaLabel, { color: colors.onPrimary }]}>
            Sign up
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/auth/login')}
          style={({ pressed }) => [
            styles.cta,
            {
              backgroundColor: colors.iconSoft,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Text style={[styles.ctaLabel, { color: colors.primary }]}>
            Log in
          </Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  cta: {
    borderRadius: 999,
    minHeight: 56,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 17,
  },
});
