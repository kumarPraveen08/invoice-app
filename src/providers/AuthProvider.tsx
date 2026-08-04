import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { useLinkingURL } from 'expo-linking';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/shared/lib/supabase';
import * as authService from '@/services/auth';

export type AuthContextValue = {
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  authLinkError: string | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<string | null>;
  refreshSession: () => Promise<string | null>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLinkError, setAuthLinkError] = useState<string | null>(null);
  const linkingUrl = useLinkingURL();

  useEffect(() => {
    let mounted = true;

    void authService.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data);
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
    if (!linkingUrl) return;

    void authService.createSessionFromUrl(linkingUrl).then(({ data, error }) => {
      if (error) {
        setAuthLinkError(error);
        return;
      }
      if (data) {
        setAuthLinkError(null);
        setSession(data);
      }
    });
  }, [linkingUrl]);

  useEffect(() => {
    const onAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') {
        void supabase.auth.startAutoRefresh();
      } else {
        void supabase.auth.stopAutoRefresh();
      }
    };

    const sub = AppState.addEventListener('change', onAppStateChange);
    // Ensure refresh is running while the provider mounts in the foreground.
    void supabase.auth.startAutoRefresh();

    return () => {
      sub.remove();
      void supabase.auth.stopAutoRefresh();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await authService.signInWithPassword(email, password);
    return error;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await authService.signUpWithPassword(email, password);
    return error;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await authService.signOut();
    return error;
  }, []);

  const refreshSession = useCallback(async () => {
    const { error } = await authService.refreshSession();
    return error;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      loading,
      isAuthenticated: session !== null,
      authLinkError,
      signIn,
      signUp,
      signOut,
      refreshSession,
    }),
    [session, loading, authLinkError, signIn, signUp, signOut, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
