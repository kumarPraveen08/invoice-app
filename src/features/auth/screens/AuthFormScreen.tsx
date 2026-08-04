import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Screen, Text, useTheme } from '@/shared/design-system';
import { useAuth } from '@/hooks/useAuth';

type Mode = 'login' | 'signup';

type Props = {
  mode: Mode;
};

export function AuthFormScreen({ mode }: Props) {
  const { colors, space } = useTheme();
  const insets = useSafeAreaInsets();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const title = mode === 'signup' ? 'Create your account' : 'Welcome back';
  const subtitle =
    mode === 'signup'
      ? 'Use an email you can access later.'
      : 'Enter your details to continue.';
  const cta = mode === 'signup' ? 'Create account' : 'Log in';

  const submit = async () => {
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setError('Enter a valid email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      const authError =
        mode === 'signup'
          ? await signUp(trimmed, password)
          : await signIn(trimmed, password);

      if (authError) {
        setError(authError);
        return;
      }

      // Root layout gate redirects to tabs when session is present.
      router.replace('/(tabs)');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View
          style={{
            paddingTop: insets.top + space.md,
            paddingHorizontal: space.lg,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={() => router.back()}
            hitSlop={8}
            style={{ alignSelf: 'flex-start' }}
          >
            <Text variant="label" style={{ color: colors.primary }}>
              Back
            </Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: space.lg,
            paddingTop: space.xl,
            paddingBottom: space.lg,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            variant="caption"
            muted
            style={{ marginBottom: space.md, fontSize: 14 }}
          >
            {mode === 'signup' ? 'Sign up' : 'Log in'}
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
            {title}
          </Text>
          <Text
            style={{
              color: colors.onSurfaceMuted,
              fontSize: 18,
              lineHeight: 26,
              fontWeight: '500',
              marginBottom: space['2xl'],
            }}
          >
            {subtitle}
          </Text>

          <TextInput
            value={email}
            onChangeText={(v) => {
              setError('');
              setEmail(v);
            }}
            placeholder="you@business.com"
            placeholderTextColor={colors.onSurfaceMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            style={[
              styles.input,
              {
                color: colors.onSurface,
                borderBottomColor: error
                  ? '#B3261E'
                  : colors.onSurfaceMuted,
              },
            ]}
          />
          <TextInput
            value={password}
            onChangeText={(v) => {
              setError('');
              setPassword(v);
            }}
            placeholder="Password"
            placeholderTextColor={colors.onSurfaceMuted}
            secureTextEntry
            style={[
              styles.input,
              {
                color: colors.onSurface,
                borderBottomColor: colors.onSurfaceMuted,
                marginTop: space.lg,
              },
            ]}
          />

          {error ? (
            <Text
              variant="caption"
              style={{ color: '#B3261E', marginTop: 6 }}
            >
              {error}
            </Text>
          ) : null}
        </ScrollView>

        <View
          style={{
            paddingHorizontal: space.lg,
            paddingBottom: Math.max(insets.bottom, space.lg),
            gap: space.sm,
          }}
        >
          <Pressable
            accessibilityRole="button"
            disabled={submitting}
            onPress={() => {
              void submit();
            }}
            style={({ pressed }) => [
              styles.cta,
              {
                backgroundColor: colors.primary,
                opacity: submitting ? 0.7 : pressed ? 0.9 : 1,
              },
            ]}
          >
            {submitting ? (
              <ActivityIndicator color={colors.onPrimary} />
            ) : (
              <Text
                style={{
                  color: colors.onPrimary,
                  fontWeight: '700',
                  textAlign: 'center',
                  fontSize: 17,
                }}
              >
                {cta}
              </Text>
            )}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              router.replace(mode === 'signup' ? '/auth/login' : '/auth/signup')
            }
            style={({ pressed }) => ({
              paddingVertical: 12,
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text
              style={{
                color: colors.primary,
                fontWeight: '600',
                textAlign: 'center',
                fontSize: 16,
              }}
            >
              {mode === 'signup'
                ? 'Already have an account? Log in'
                : 'Need an account? Sign up'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  input: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontSize: 24,
    fontWeight: '600',
    paddingVertical: 12,
  },
  cta: {
    borderRadius: 999,
    minHeight: 56,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
