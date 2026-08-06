import 'react-native-url-polyfill/auto';

import { createClient, type SupabaseClient, type SupportedStorage } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type AppSupabaseClient = SupabaseClient<Database>;

const SECURE_STORE_CHUNK_SIZE = 1800;
const CHUNK_COUNT_SUFFIX = '__chunk_count';

const chunkKey = (key: string, index: number): string => `${key}__${index}`;
const chunkCountKey = (key: string): string => `${key}${CHUNK_COUNT_SUFFIX}`;

const secureStoreOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

const ExpoSecureStoreAdapter: SupportedStorage = {
  async getItem(key: string): Promise<string | null> {
    const countRaw = await SecureStore.getItemAsync(chunkCountKey(key), secureStoreOptions);

    if (countRaw === null) {
      return SecureStore.getItemAsync(key, secureStoreOptions);
    }

    const chunkCount = Number.parseInt(countRaw, 10);
    if (!Number.isFinite(chunkCount) || chunkCount < 1) {
      return null;
    }

    const chunks: string[] = [];
    for (let index = 0; index < chunkCount; index += 1) {
      const chunk = await SecureStore.getItemAsync(chunkKey(key, index), secureStoreOptions);
      if (chunk === null) {
        return null;
      }
      chunks.push(chunk);
    }

    return chunks.join('');
  },

  async setItem(key: string, value: string): Promise<void> {
    await ExpoSecureStoreAdapter.removeItem(key);

    const chunks: string[] = [];
    for (let offset = 0; offset < value.length; offset += SECURE_STORE_CHUNK_SIZE) {
      chunks.push(value.slice(offset, offset + SECURE_STORE_CHUNK_SIZE));
    }

    await Promise.all(
      chunks.map((chunk, index) =>
        SecureStore.setItemAsync(chunkKey(key, index), chunk, secureStoreOptions),
      ),
    );

    await SecureStore.setItemAsync(chunkCountKey(key), String(chunks.length), secureStoreOptions);
  },

  async removeItem(key: string): Promise<void> {
    const countRaw = await SecureStore.getItemAsync(chunkCountKey(key), secureStoreOptions);

    if (countRaw !== null) {
      const chunkCount = Number.parseInt(countRaw, 10);
      if (Number.isFinite(chunkCount) && chunkCount > 0) {
        await Promise.all(
          Array.from({ length: chunkCount }, (_, index) =>
            SecureStore.deleteItemAsync(chunkKey(key, index), secureStoreOptions).catch(
              () => undefined,
            ),
          ),
        );
      }

      await SecureStore.deleteItemAsync(chunkCountKey(key), secureStoreOptions).catch(
        () => undefined,
      );
    }

    await SecureStore.deleteItemAsync(key, secureStoreOptions).catch(() => undefined);
  },
};

function requireSupabaseEnv(): { url: string; anonKey: string } {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  const missing: string[] = [];
  if (!url) missing.push('EXPO_PUBLIC_SUPABASE_URL');
  if (!anonKey) missing.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');

  if (missing.length > 0) {
    throw new Error(
      `[supabase] Missing required environment variable(s): ${missing.join(', ')}. ` +
        'Add them to your .env and restart Expo.',
    );
  }

  return { url: url!, anonKey: anonKey! };
}

const { url: supabaseUrl, anonKey: supabaseAnonKey } = requireSupabaseEnv();

export const supabase: AppSupabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});
