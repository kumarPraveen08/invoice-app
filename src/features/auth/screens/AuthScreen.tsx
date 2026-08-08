import { Pressable, StyleSheet, View } from 'react-native';
import { Screen, Text, useTheme } from '@/shared/design-system';
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function AuthScreen() {
  const { colors, space } = useTheme();
  const { signInAsGuest } = useAuth();

  return (
    <Screen>
      <View style={styles.container}>
        <Text
          variant="caption"
          muted
          style={{ marginBottom: space.md, fontSize: 14 }}
        >
          Sign in
        </Text>
        <Text
          style={{
            color: colors.onSurface,
            fontSize: 34,
            lineHeight: 40,
            fontWeight: '800',
            letterSpacing: -0.8,
            marginBottom: space.sm,
            textAlign: 'center',
          }}
        >
          Continue with Google
        </Text>
        <Text
          style={{
            color: colors.onSurfaceMuted,
            fontSize: 18,
            lineHeight: 26,
            fontWeight: '500',
            textAlign: 'center',
            marginBottom: space['2xl'],
          }}
        >
          Use Google for sync, or continue as a guest on this device.
        </Text>

        <View style={{ width: '100%', gap: space.sm }}>
          <GoogleSignInButton />
          <Pressable
            accessibilityRole="button"
            onPress={signInAsGuest}
            style={({ pressed }) => ({
              minHeight: 52,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text
              style={{
                color: colors.primary,
                fontWeight: '600',
                fontSize: 16,
              }}
            >
              Sign in as guest
            </Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
