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
  signInWithGoogle: () => Promise<string | null>;
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

export function AuthProvider({ children }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

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
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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

      return null;
    } catch (error) {
      return formatAuthError(error as Error);
    }
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    return error ? formatAuthError(error) : null;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      signInWithGoogle,
      signOut,
    }),
    [session, loading, signInWithGoogle, signOut],
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
