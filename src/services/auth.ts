import type { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/shared/lib/supabase';

export type AuthResult<T> = {
  data: T;
  error: string | null;
};

function toFriendlyAuthError(error: AuthError | Error | null | undefined): string {
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
