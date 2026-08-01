import type { ThemeSeed } from "@/shared/design-system/tokens/colors";
import type { ThemePreference } from "@/shared/design-system/theme";

export type DateFormat = "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
export type TimeFormat = "12h" | "24h";

export type BusinessDetails = {
  name: string;
  phone: string;
  email: string;
  taxNumber: string;
  website: string;
  address: string;
};

export type BrandingDetails = {
  logoUri: string | null;
  signatureUri: string | null;
  signatureName: string;
};

export type BankDetails = {
  accountName: string;
  accountNumber: string;
  bankName: string;
  routingCode: string;
  paymentInstructions: string;
};

export type AppPreferences = {
  currency: string;
  taxRate: string;
  dateFormat: DateFormat;
  timeFormat: TimeFormat;
  invoicePrefix: string;
  invoiceNextNumber: string;
};

export type InvoiceDefaults = {
  notes: string;
  terms: string;
};

export type AppearanceSettings = {
  mode: ThemePreference;
  seed: ThemeSeed;
};

export type InvoiceTemplateLayout =
  | "classic"
  | "modern"
  | "compact"
  | "centered"
  | "stripe"
  | "formal";

export type InvoiceTemplateFont =
  | "sans"
  | "serif"
  | "mono"
  | "rounded"
  | "condensed"
  | "times";

export type InvoiceTemplateFields = {
  logo: boolean;
  businessAddress: boolean;
  taxNumber: boolean;
  dueDate: boolean;
  notes: boolean;
  terms: boolean;
  bankDetails: boolean;
  signature: boolean;
};

export type InvoiceTemplate = {
  id: string;
  name: string;
  layout: InvoiceTemplateLayout;
  accent: string;
  font: InvoiceTemplateFont;
  fields: InvoiceTemplateFields;
};

export type InvoiceTemplateLibrary = {
  defaultId: string;
  customs: InvoiceTemplate[];
};

export type AppSettings = {
  business: BusinessDetails;
  branding: BrandingDetails;
  bank: BankDetails;
  preferences: AppPreferences;
  invoiceDefaults: InvoiceDefaults;
  appearance: AppearanceSettings;
  invoiceTemplates: InvoiceTemplateLibrary;
};

export const defaultSettings: AppSettings = {
  business: {
    name: "",
    phone: "",
    email: "",
    taxNumber: "",
    website: "",
    address: "",
  },
  branding: {
    logoUri: null,
    signatureUri: null,
    signatureName: "",
  },
  bank: {
    accountName: "",
    accountNumber: "",
    bankName: "",
    routingCode: "",
    paymentInstructions: "",
  },
  preferences: {
    currency: "INR",
    taxRate: "18",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "12h",
    invoicePrefix: "INV-",
    invoiceNextNumber: "1001",
  },
  invoiceDefaults: {
    notes: "",
    terms: "",
  },
  appearance: {
    mode: "system",
    seed: "violet",
  },
  invoiceTemplates: {
    defaultId: "preset_base",
    customs: [],
  },
};
