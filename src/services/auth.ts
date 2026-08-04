import type { AuthError, EmailOtpType, Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { supabase } from '@/shared/lib/supabase';
import { getAuthRedirectUrl, isAuthCallbackUrl } from '@/shared/lib/auth-redirect';

export type AuthResult<T> = {
  data: T;
  error: string | null;
};

export function toFriendlyAuthError(error: AuthError | Error | null | undefined): string {
  if (!error) {
    return 'Something went wrong. Try again.';
  }

  const message = error.message.toLowerCase();
  const status = 'status' in error ? error.status : undefined;
  const code = 'code' in error && typeof error.code === 'string' ? error.code : undefined;

  if (
    code === 'invalid_credentials' ||
    message.includes('invalid login credentials') ||
    message.includes('invalid email or password')
  ) {
    return 'Email or password is incorrect.';
  }

  if (
    code === 'user_already_exists' ||
    message.includes('user already registered') ||
    message.includes('already been registered')
  ) {
    return 'An account with this email already exists.';
  }

  if (
    code === 'weak_password' ||
    message.includes('password should be at least') ||
    message.includes('password is known to be weak')
  ) {
    return 'Password is too weak. Use at least 6 characters.';
  }

  if (
    code === 'email_not_confirmed' ||
    message.includes('email not confirmed')
  ) {
    return 'Confirm your email before signing in.';
  }

  if (
    code === 'over_request_rate_limit' ||
    message.includes('rate limit') ||
    status === 429
  ) {
    return 'Too many attempts. Wait a moment and try again.';
  }

  if (
    message.includes('network') ||
    message.includes('fetch failed') ||
    message.includes('failed to fetch')
  ) {
    return 'Network error. Check your connection and try again.';
  }

  if (message.includes('invalid email')) {
    return 'Enter a valid email.';
  }

  return 'Something went wrong. Try again.';
}

function collectUrlParams(url: string): Record<string, string> {
  const parsed = Linking.parse(url);
  const collected: Record<string, string> = {};

  for (const [key, value] of Object.entries(parsed.queryParams ?? {})) {
    if (typeof value === 'string') {
      collected[key] = value;
    } else if (Array.isArray(value) && typeof value[0] === 'string') {
      collected[key] = value[0];
    }
  }

  const hashIndex = url.indexOf('#');
  if (hashIndex === -1) {
    return collected;
  }

  for (const part of url.slice(hashIndex + 1).split('&')) {
    const [rawKey, rawValue] = part.split('=');
    if (!rawKey || !rawValue) continue;
    collected[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue);
  }

  return collected;
}

/** Exchange tokens or PKCE code from a deep link into a Supabase session. */
export async function createSessionFromUrl(
  url: string,
): Promise<AuthResult<Session | null>> {
  if (!isAuthCallbackUrl(url)) {
    return { data: null, error: null };
  }

  const params = collectUrlParams(url);

  if (params.error_description || params.error || params.error_code) {
    const message = params.error_description ?? params.error ?? params.error_code;
    return {
      data: null,
      error: toFriendlyAuthError(new Error(message)),
    };
  }

  if (params.code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(params.code);
    if (error) {
      return { data: null, error: toFriendlyAuthError(error) };
    }
    return { data: data.session, error: null };
  }

  if (params.access_token && params.refresh_token) {
    const { data, error } = await supabase.auth.setSession({
      access_token: params.access_token,
      refresh_token: params.refresh_token,
    });
    if (error) {
      return { data: null, error: toFriendlyAuthError(error) };
    }
    return { data: data.session, error: null };
  }

  if (params.token_hash && params.type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: params.token_hash,
      type: params.type as EmailOtpType,
    });
    if (error) {
      return { data: null, error: toFriendlyAuthError(error) };
    }
    return { data: data.session, error: null };
  }

  return { data: null, error: null };
}

export async function getSession(): Promise<AuthResult<Session | null>> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    return { data: null, error: toFriendlyAuthError(error) };
  }
  return { data: data.session, error: null };
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<AuthResult<{ user: User | null; session: Session | null }>> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return {
      data: { user: null, session: null },
      error: toFriendlyAuthError(error),
    };
  }

  return {
    data: { user: data.user, session: data.session },
    error: null,
  };
}

export async function signUpWithPassword(
  email: string,
  password: string,
): Promise<AuthResult<{ user: User | null; session: Session | null }>> {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: getAuthRedirectUrl(),
    },
  });

  if (error) {
    return {
      data: { user: null, session: null },
      error: toFriendlyAuthError(error),
    };
  }

  // Project may require email confirmation before a session is issued.
  if (!data.session && data.user) {
    return {
      data: { user: data.user, session: null },
      error: 'Account created. Check your email to confirm, then sign in.',
    };
  }

  return {
    data: { user: data.user, session: data.session },
    error: null,
  };
}

export async function signOut(): Promise<AuthResult<null>> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { data: null, error: toFriendlyAuthError(error) };
  }
  return { data: null, error: null };
}

export async function refreshSession(): Promise<AuthResult<Session | null>> {
  const { data, error } = await supabase.auth.refreshSession();
  if (error) {
    return { data: null, error: toFriendlyAuthError(error) };
  }
  return { data: data.session, error: null };
}
