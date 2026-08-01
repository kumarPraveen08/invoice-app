import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createId } from '@/shared/lib/id';
import { mmkvStorage } from '@/shared/lib/mmkv';
import {
  DEFAULT_TEMPLATE_ID,
  findTemplate,
  isPresetTemplateId,
} from './templateConstants';
import {
  defaultSettings,
  type AppSettings,
  type AppearanceSettings,
  type BankDetails,
  type BrandingDetails,
  type BusinessDetails,
  type InvoiceDefaults,
  type InvoiceTemplate,
  type InvoiceTemplateFields,
  type AppPreferences,
} from './types';

type SettingsState = AppSettings & {
  updateBusiness: (patch: Partial<BusinessDetails>) => void;
  updateBranding: (patch: Partial<BrandingDetails>) => void;
  updateBank: (patch: Partial<BankDetails>) => void;
  updatePreferences: (patch: Partial<AppPreferences>) => void;
  updateInvoiceDefaults: (patch: Partial<InvoiceDefaults>) => void;
  updateAppearance: (patch: Partial<AppearanceSettings>) => void;
  setDefaultTemplateId: (id: string) => void;
  /** Clone a preset/custom into an editable custom template. */
  createCustomTemplate: (fromId: string, name?: string) => string | null;
  updateCustomTemplate: (
    id: string,
    patch: Partial<Omit<InvoiceTemplate, 'id'>>,
  ) => void;
  updateCustomTemplateFields: (
    id: string,
    patch: Partial<InvoiceTemplateFields>,
  ) => void;
  removeCustomTemplate: (id: string) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
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
      setDefaultTemplateId: (id) =>
        set((state) => {
          if (!findTemplate(id, state.invoiceTemplates.customs)) return state;
          return {
            invoiceTemplates: {
              ...state.invoiceTemplates,
              defaultId: id,
            },
          };
        }),
      createCustomTemplate: (fromId, name) => {
        const source = findTemplate(fromId, get().invoiceTemplates.customs);
        if (!source) return null;
        const id = createId('tmpl');
        const custom: InvoiceTemplate = {
          ...source,
          id,
          name: name?.trim() || `${source.name} copy`,
          fields: { ...source.fields },
        };
        set((state) => ({
          invoiceTemplates: {
            ...state.invoiceTemplates,
            customs: [...state.invoiceTemplates.customs, custom],
          },
        }));
        return id;
      },
      updateCustomTemplate: (id, patch) =>
        set((state) => {
          if (isPresetTemplateId(id)) return state;
          return {
            invoiceTemplates: {
              ...state.invoiceTemplates,
              customs: state.invoiceTemplates.customs.map((item) =>
                item.id === id ? { ...item, ...patch } : item,
              ),
            },
          };
        }),
      updateCustomTemplateFields: (id, patch) =>
        set((state) => {
          if (isPresetTemplateId(id)) return state;
          return {
            invoiceTemplates: {
              ...state.invoiceTemplates,
              customs: state.invoiceTemplates.customs.map((item) =>
                item.id === id
                  ? { ...item, fields: { ...item.fields, ...patch } }
                  : item,
              ),
            },
          };
        }),
      removeCustomTemplate: (id) =>
        set((state) => {
          if (isPresetTemplateId(id)) return state;
          const customs = state.invoiceTemplates.customs.filter(
            (item) => item.id !== id,
          );
          const defaultId =
            state.invoiceTemplates.defaultId === id
              ? DEFAULT_TEMPLATE_ID
              : state.invoiceTemplates.defaultId;
          return {
            invoiceTemplates: { defaultId, customs },
          };
        }),
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
        invoiceTemplates: state.invoiceTemplates,
      }),
      merge: (persisted, current) => {
        const stored = (persisted ?? {}) as Partial<AppSettings> & {
          invoiceTemplate?: unknown;
        };
        const library =
          stored.invoiceTemplates ?? current.invoiceTemplates;
        return {
          ...current,
          ...stored,
          appearance: {
            ...current.appearance,
            ...(stored.appearance ?? {}),
          },
          invoiceTemplates: {
            defaultId: library.defaultId || DEFAULT_TEMPLATE_ID,
            customs: library.customs ?? [],
          },
        };
      },
    },
  ),
);
