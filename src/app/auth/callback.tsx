import { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Screen, Text, useTheme } from '@/shared/design-system';
import { useAuth } from '@/hooks/useAuth';

export default function AuthCallbackScreen() {
  const { colors, space } = useTheme();
  const { authLinkError, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  return (
    <Screen>
      <View style={styles.center}>
        {authLinkError ? (
          <>
            <Text
              style={{
                color: '#B3261E',
                fontSize: 18,
                fontWeight: '600',
                textAlign: 'center',
                marginBottom: space.sm,
              }}
            >
              Sign-in link failed
            </Text>
            <Text
              style={{
                color: colors.onSurfaceMuted,
                fontSize: 16,
                lineHeight: 24,
                textAlign: 'center',
              }}
            >
              {authLinkError}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace('/auth/login')}
              style={({ pressed }) => ({
                marginTop: space.lg,
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text
                style={{
                  color: colors.primary,
                  fontSize: 16,
                  fontWeight: '600',
                  textAlign: 'center',
                }}
              >
                Back to sign in
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text
              style={{
                color: colors.onSurfaceMuted,
                fontSize: 16,
                marginTop: space.lg,
                textAlign: 'center',
              }}
            >
              Signing you in...
            </Text>
          </>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
