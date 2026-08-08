import {
  createElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import type { AuthError, Session, User } from '@supabase/supabase-js';
import { useSettingsStore } from '@/features/settings/store';
import { supabase } from '@/shared/lib/supabase';

const REDIRECT_PATH = 'auth';
const REDIRECT_SCHEME = 'invoiceapp';
const REDIRECT_URL = AuthSession.makeRedirectUri({
  scheme: REDIRECT_SCHEME,
  path: REDIRECT_PATH,
});

export type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  /** True when continuing without Google (local guest). */
  isGuest: boolean;
  signInWithGoogle: () => Promise<string | null>;
  signInAsGuest: () => void;
  signOut: () => Promise<string | null>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type Props = {
  children: ReactNode;
};

function formatAuthError(error: AuthError | Error | null | undefined): string {
  if (!error) {
    return 'Something went wrong. Try again.';
  }

  const message = error.message.toLowerCase();

  if (message.includes('cancel') || message.includes('dismiss')) {
    return 'Sign-in cancelled.';
  }

  if (message.includes('network') || message.includes('fetch failed')) {
    return 'Network error. Check your connection and try again.';
  }

  if (message.includes('browser') || message.includes('popup')) {
    return 'Browser blocked sign-in. Try again.';
  }

  if (message.includes('redirect')) {
    return 'Sign-in redirect failed. Check auth settings.';
  }

  return 'Google sign-in failed. Try again.';
}

function parseAuthUrl(url: string): { code: string | null; error: string | null } {
  const parsed = Linking.parse(url);
  const queryParams = parsed.queryParams ?? {};
  const code = typeof queryParams.code === 'string' ? queryParams.code : null;

  if (typeof queryParams.error_description === 'string') {
    return { code, error: queryParams.error_description };
  }

  if (typeof queryParams.error === 'string') {
    return { code, error: queryParams.error };
  }

  if (typeof queryParams.error_code === 'string') {
    return { code, error: queryParams.error_code };
  }

  return { code, error: null };
}

/**
 * Supabase session + Google OAuth, plus local guest mode (`authSkipped`).
 * Owns auth state for the app; live under `features/auth`.
 */
export function AuthProvider({ children }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const authSkipped = useSettingsStore((s) => s.authSkipped);
  const skipAuth = useSettingsStore((s) => s.skipAuth);
  const clearAuthSkip = useSettingsStore((s) => s.clearAuthSkip);

  useEffect(() => {
    let mounted = true;

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) {
        return;
      }

      if (error) {
        setSession(null);
        setLoading(false);
        return;
      }

      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
      if (nextSession) {
        clearAuthSkip();
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [clearAuthSkip]);

  useEffect(() => {
    const onAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') {
        void supabase.auth.startAutoRefresh();
      } else {
        void supabase.auth.stopAutoRefresh();
      }
    };

    const subscription = AppState.addEventListener('change', onAppStateChange);
    void supabase.auth.startAutoRefresh();

    return () => {
      subscription.remove();
      void supabase.auth.stopAutoRefresh();
    };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: REDIRECT_URL,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        return formatAuthError(error);
      }

      if (!data.url) {
        return 'Google sign-in failed. Try again.';
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, REDIRECT_URL);

      if (result.type !== 'success') {
        return result.type === 'cancel' || result.type === 'dismiss'
          ? 'Sign-in cancelled.'
          : 'Google sign-in failed. Try again.';
      }

      if (!result.url) {
        return 'Google sign-in failed. Try again.';
      }

      const { code, error: urlError } = parseAuthUrl(result.url);
      if (urlError) {
        return formatAuthError(new Error(urlError));
      }

      if (!code) {
        return 'Google sign-in failed. Try again.';
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      if (exchangeError) {
        return formatAuthError(exchangeError);
      }

      clearAuthSkip();
      return null;
    } catch (error) {
      return formatAuthError(error as Error);
    }
  }, [clearAuthSkip]);

  const signInAsGuest = useCallback(() => {
    skipAuth();
  }, [skipAuth]);

  const signOut = useCallback(async () => {
    clearAuthSkip();
    if (!session) {
      return null;
    }
    const { error } = await supabase.auth.signOut();
    return error ? formatAuthError(error) : null;
  }, [clearAuthSkip, session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      isGuest: authSkipped && !session,
      signInWithGoogle,
      signInAsGuest,
      signOut,
    }),
    [session, loading, authSkipped, signInWithGoogle, signInAsGuest, signOut],
  );

  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }
  return context;
}
