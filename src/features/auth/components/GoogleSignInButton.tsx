import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from '@/shared/design-system';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  label?: string;
};

export function GoogleSignInButton({ label = 'Continue with Google' }: Props) {
  const { colors } = useTheme();
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onPress = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const error = await signInWithGoogle();
      if (error) {
        setMessage(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Pressable
        accessibilityRole="button"
        disabled={loading}
        onPress={() => {
          void onPress();
        }}
        style={({ pressed }) => [
          styles.button,
          {
            borderColor: colors.primary,
            backgroundColor: colors.primary,
            opacity: loading ? 0.75 : pressed ? 0.9 : 1,
          },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <Text
            style={{
              color: colors.onPrimary,
              fontSize: 16,
              fontWeight: '700',
              textAlign: 'center',
            }}
          >
            {label}
          </Text>
        )}
      </Pressable>

      {message ? (
        <Text
          variant="caption"
          style={{
            color: colors.onSurfaceMuted,
            textAlign: 'center',
            marginTop: 10,
          }}
        >
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
