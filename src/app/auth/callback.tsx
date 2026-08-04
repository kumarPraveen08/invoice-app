import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Screen, Text, useTheme } from '@/shared/design-system';
import { useAuth } from '@/hooks/useAuth';

export default function AuthCallbackScreen() {
  const { colors, space } = useTheme();
  const { authLinkError } = useAuth();

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
