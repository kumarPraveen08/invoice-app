// Polyfill URL APIs that Supabase auth/realtime expect in React Native.
import 'react-native-url-polyfill/auto';

// Typed Supabase factory + client class used for the app-wide singleton.
import { createClient, type SupabaseClient, type SupportedStorage } from '@supabase/supabase-js';

// Expo Secure Store: encrypted Keychain (iOS) / Keystore-backed prefs (Android).
import * as SecureStore from 'expo-secure-store';

/**
 * Database schema types for typed queries.
 * Replace with generated types when schema is ready:
 * `npx supabase gen types typescript --project-id <id> > src/shared/types/database.ts`
 */
export type Database = {
  // Public schema namespace expected by supabase-js generics.
  public: {
    // Tables map — empty until you generate real table defs.
    Tables: Record<string, never>;
    // Views map — empty until you generate real view defs.
    Views: Record<string, never>;
    // RPC / SQL functions map — empty until generated.
    Functions: Record<string, never>;
    // Postgres enums map — empty until generated.
    Enums: Record<string, never>;
    // Composite types map — empty until generated.
    CompositeTypes: Record<string, never>;
  };
};

// Convenience alias for a fully typed Supabase client in this app.
export type AppSupabaseClient = SupabaseClient<Database>;

// Historical iOS Keychain limit ~2048 bytes; stay under with margin.
const SECURE_STORE_CHUNK_SIZE = 1800;

// Suffix for the metadata key that stores how many chunks exist.
const CHUNK_COUNT_SUFFIX = '__chunk_count';

// Suffix pattern builder for an individual chunk key index.
const chunkKey = (key: string, index: number): string => `${key}__${index}`;

// Key that holds the numeric chunk count for a logical storage key.
const chunkCountKey = (key: string): string => `${key}${CHUNK_COUNT_SUFFIX}`;

// iOS accessibility: readable after first unlock (works with token refresh).
const secureStoreOptions: SecureStore.SecureStoreOptions = {
  // Prefer AFTER_FIRST_UNLOCK so session restore can run after reboot unlock.
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

/**
 * Auth storage adapter backed only by Expo Secure Store.
 * Chunks large session payloads so Keychain size limits do not drop sessions.
 * Implements Supabase SupportedStorage (getItem / setItem / removeItem).
 */
const ExpoSecureStoreAdapter: SupportedStorage = {
  // Read a persisted auth value (reassembled from chunks when needed).
  async getItem(key: string): Promise<string | null> {
    // Load the chunk-count metadata for this logical key.
    const countRaw = await SecureStore.getItemAsync(chunkCountKey(key), secureStoreOptions);

    // No chunk metadata — try a single (non-chunked) read for compatibility.
    if (countRaw === null) {
      // Fallback path used if an older non-chunked value was stored.
      return SecureStore.getItemAsync(key, secureStoreOptions);
    }

    // Parse how many chunks were written for this key.
    const chunkCount = Number.parseInt(countRaw, 10);

    // Guard against corrupt metadata so auth can recover cleanly.
    if (!Number.isFinite(chunkCount) || chunkCount < 1) {
      // Treat corrupt metadata as a missing session.
      return null;
    }

    // Accumulate each chunk in order.
    const chunks: string[] = [];

    // Iterate every stored chunk index for this key.
    for (let index = 0; index < chunkCount; index += 1) {
      // Read one chunk from Secure Store.
      const chunk = await SecureStore.getItemAsync(chunkKey(key, index), secureStoreOptions);

      // Incomplete chunk set means the session is unusable — treat as missing.
      if (chunk === null) {
        // Abort reassembly early.
        return null;
      }

      // Keep this chunk for joining.
      chunks.push(chunk);
    }

    // Join chunks back into the original session JSON string.
    return chunks.join('');
  },

  // Persist an auth value, splitting into Secure Store–safe chunks.
  async setItem(key: string, value: string): Promise<void> {
    // Remove any previous chunks/metadata before writing the new value.
    await ExpoSecureStoreAdapter.removeItem(key);

    // Split the value into fixed-size slices under the Keychain size limit.
    const chunks: string[] = [];

    // Walk the string and slice by CHUNK_SIZE.
    for (let offset = 0; offset < value.length; offset += SECURE_STORE_CHUNK_SIZE) {
      // Push one slice into the chunks array.
      chunks.push(value.slice(offset, offset + SECURE_STORE_CHUNK_SIZE));
    }

    // Persist each chunk under a deterministic indexed key.
    await Promise.all(
      // Map every chunk to a Secure Store write.
      chunks.map((chunk, index) =>
        // Write chunk N for this logical key.
        SecureStore.setItemAsync(chunkKey(key, index), chunk, secureStoreOptions),
      ),
    );

    // Store the chunk count so getItem knows how many pieces to load.
    await SecureStore.setItemAsync(chunkCountKey(key), String(chunks.length), secureStoreOptions);
  },

  // Delete all chunks + metadata for a logical auth key.
  async removeItem(key: string): Promise<void> {
    // Read existing chunk count so we know which indexed keys to delete.
    const countRaw = await SecureStore.getItemAsync(chunkCountKey(key), secureStoreOptions);

    // If chunk metadata exists, delete each indexed chunk.
    if (countRaw !== null) {
      // Parse the stored chunk count.
      const chunkCount = Number.parseInt(countRaw, 10);

      // Only iterate when the count looks valid.
      if (Number.isFinite(chunkCount) && chunkCount > 0) {
        // Delete every indexed chunk in parallel.
        await Promise.all(
          // Build delete calls for indices 0..chunkCount-1.
          Array.from({ length: chunkCount }, (_, index) =>
            // Ignore individual delete failures (key may already be gone).
            SecureStore.deleteItemAsync(chunkKey(key, index), secureStoreOptions).catch(() => undefined),
          ),
        );
      }

      // Delete the chunk-count metadata key itself.
      await SecureStore.deleteItemAsync(chunkCountKey(key), secureStoreOptions).catch(() => undefined);
    }

    // Also delete a possible non-chunked legacy value under the raw key.
    await SecureStore.deleteItemAsync(key, secureStoreOptions).catch(() => undefined);
  },
};

/**
 * Validate required Expo public env vars at import time (app startup).
 * Fails fast with a clear message instead of a cryptic network/auth error later.
 */
function requireSupabaseEnv(): { url: string; anonKey: string } {
  // Read the project URL injected by Expo from EXPO_PUBLIC_* at bundling time.
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;

  // Read the anon (publishable) key — safe for client use with RLS enabled.
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  // Collect which variables are missing for a precise error message.
  const missing: string[] = [];

  // Track a missing URL.
  if (!url) {
    // Push the exact env var name developers must set.
    missing.push('EXPO_PUBLIC_SUPABASE_URL');
  }

  // Track a missing anon key.
  if (!anonKey) {
    // Push the exact env var name developers must set.
    missing.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');
  }

  // Throw immediately if anything required is absent.
  if (missing.length > 0) {
    // Clear, actionable startup error for local .env / EAS secrets misconfig.
    throw new Error(
      `[supabase] Missing required environment variable(s): ${missing.join(', ')}. ` +
        `Add them to your .env (see .env.example), then restart Expo (` +
        `EXPO_PUBLIC_* values are inlined at bundling time).`,
    );
  }

  // Narrow types after the guards above (TypeScript still sees string | undefined).
  return {
    // Non-null assertion is safe: we threw if url was falsy.
    url: url!,
    // Non-null assertion is safe: we threw if anonKey was falsy.
    anonKey: anonKey!,
  };
}

// Resolve and validate credentials once when this module loads.
const { url: supabaseUrl, anonKey: supabaseAnonKey } = requireSupabaseEnv();

/**
 * App-wide Supabase singleton.
 * - Secure Store session persistence (no AsyncStorage)
 * - Auto token refresh for long-lived sessions
 * - detectSessionInUrl disabled (mobile has no browser URL session)
 * - PKCE flow for public native clients
 */
export const supabase: AppSupabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  // Auth-specific client options for React Native / Expo.
  auth: {
    // Persist sessions via the Secure Store adapter defined above.
    storage: ExpoSecureStoreAdapter,
    // Refresh access tokens in the background before they expire.
    autoRefreshToken: true,
    // Keep the session across app restarts using `storage`.
    persistSession: true,
    // Mobile apps do not parse auth tokens from a browser URL bar.
    detectSessionInUrl: false,
    // PKCE is the recommended OAuth/auth code flow for public native clients.
    flowType: 'pkce',
  },
});
