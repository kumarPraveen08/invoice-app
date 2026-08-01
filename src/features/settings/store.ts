import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '@/shared/lib/mmkv';
import {
  defaultSettings,
  type AppSettings,
  type AppearanceSettings,
  type BankDetails,
  type BrandingDetails,
  type BusinessDetails,
  type InvoiceDefaults,
  type AppPreferences,
} from './types';

type SettingsState = AppSettings & {
  updateBusiness: (patch: Partial<BusinessDetails>) => void;
  updateBranding: (patch: Partial<BrandingDetails>) => void;
  updateBank: (patch: Partial<BankDetails>) => void;
  updatePreferences: (patch: Partial<AppPreferences>) => void;
  updateInvoiceDefaults: (patch: Partial<InvoiceDefaults>) => void;
  updateAppearance: (patch: Partial<AppearanceSettings>) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,
      updateBusiness: (patch) =>
        set((state) => ({ business: { ...state.business, ...patch } })),
      updateBranding: (patch) =>
        set((state) => ({ branding: { ...state.branding, ...patch } })),
      updateBank: (patch) =>
        set((state) => ({ bank: { ...state.bank, ...patch } })),
      updatePreferences: (patch) =>
        set((state) => ({ preferences: { ...state.preferences, ...patch } })),
      updateInvoiceDefaults: (patch) =>
        set((state) => ({
          invoiceDefaults: { ...state.invoiceDefaults, ...patch },
        })),
      updateAppearance: (patch) =>
        set((state) => ({
          appearance: { ...state.appearance, ...patch },
        })),
    }),
    {
      name: 'invoice-app-settings',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        business: state.business,
        branding: state.branding,
        bank: state.bank,
        preferences: state.preferences,
        invoiceDefaults: state.invoiceDefaults,
        appearance: state.appearance,
      }),
      merge: (persisted, current) => {
        const stored = (persisted ?? {}) as Partial<AppSettings>;
        return {
          ...current,
          ...stored,
          appearance: {
            ...current.appearance,
            ...(stored.appearance ?? {}),
          },
        };
      },
    },
  ),
);
