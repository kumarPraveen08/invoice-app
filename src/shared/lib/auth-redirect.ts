import * as Linking from 'expo-linking';

const AUTH_CALLBACK_PATH = 'auth/callback';

/** Deep link Supabase should redirect to after email confirm / magic link. */
export function getAuthRedirectUrl(): string {
  return Linking.createURL(AUTH_CALLBACK_PATH);
}

export const AUTH_CALLBACK_ROUTE = AUTH_CALLBACK_PATH;

export function isAuthCallbackUrl(url: string): boolean {
  const parsed = Linking.parse(url);
  return parsed.path === AUTH_CALLBACK_PATH || parsed.path === `/${AUTH_CALLBACK_PATH}`;
}
