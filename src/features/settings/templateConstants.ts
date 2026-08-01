import type {
  InvoiceTemplate,
  InvoiceTemplateFields,
  InvoiceTemplateFont,
  InvoiceTemplateLayout,
} from "./types";

export const FREE_PLAN_BRANDING = true;
export const FREE_WATERMARK_LABEL = "Invoice App";
export const FREE_FOOTER_COPYRIGHT =
  "© Invoice App · Upgrade to remove branding";

export const DEFAULT_TEMPLATE_ID = "preset_base";

export const DEFAULT_TEMPLATE_FIELDS: InvoiceTemplateFields = {
  logo: true,
  businessAddress: true,
  taxNumber: true,
  dueDate: true,
  notes: true,
  terms: true,
  bankDetails: true,
  signature: true,
};

export const TEMPLATE_LAYOUTS: {
  id: InvoiceTemplateLayout;
  label: string;
}[] = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "compact", label: "Compact" },
  { id: "centered", label: "Centered" },
  { id: "stripe", label: "Stripe" },
  { id: "formal", label: "Formal" },
];

export const TEMPLATE_FONTS: {
  id: InvoiceTemplateFont;
  label: string;
}[] = [
  { id: "sans", label: "Sans" },
  { id: "serif", label: "Serif" },
  { id: "mono", label: "Mono" },
  { id: "rounded", label: "Rounded" },
  { id: "condensed", label: "Condensed" },
  { id: "times", label: "Times" },
];

export const TEMPLATE_ACCENTS = [
  "#1A1A1A",
  "#1B4F72",
  "#1B6B4A",
  "#5B4FC9",
  "#8B3A2A",
  "#6B4C2A",
] as const;

export const TEMPLATE_FIELD_ROWS: {
  key: keyof InvoiceTemplateFields;
  label: string;
}[] = [
  { key: "logo", label: "Logo" },
  { key: "businessAddress", label: "Business address" },
  { key: "taxNumber", label: "Tax number" },
  { key: "dueDate", label: "Due date" },
  { key: "notes", label: "Notes" },
  { key: "terms", label: "Terms" },
  { key: "bankDetails", label: "Bank details" },
  { key: "signature", label: "Signature" },
];

/** Built-in designs. Base is the default for new installs. */
export const PRESET_TEMPLATES: InvoiceTemplate[] = [
  {
    id: DEFAULT_TEMPLATE_ID,
    name: "Base",
    layout: "classic",
    accent: "#1B4F72",
    font: "sans",
    fields: { ...DEFAULT_TEMPLATE_FIELDS },
  },
  {
    id: "preset_modern",
    name: "Modern",
    layout: "modern",
    accent: "#5B4FC9",
    font: "rounded",
    fields: { ...DEFAULT_TEMPLATE_FIELDS },
  },
  {
    id: "preset_compact",
    name: "Compact",
    layout: "compact",
    accent: "#1B6B4A",
    font: "condensed",
    fields: {
      ...DEFAULT_TEMPLATE_FIELDS,
      taxNumber: false,
      terms: false,
    },
  },
  {
    id: "preset_minimal",
    name: "Minimal",
    layout: "classic",
    accent: "#1A1A1A",
    font: "serif",
    fields: {
      ...DEFAULT_TEMPLATE_FIELDS,
      logo: true,
      businessAddress: false,
      taxNumber: false,
      bankDetails: false,
      signature: true,
      notes: true,
      terms: false,
      dueDate: true,
    },
  },
  {
    id: "preset_bold",
    name: "Bold",
    layout: "modern",
    accent: "#8B3A2A",
    font: "sans",
    fields: {
      ...DEFAULT_TEMPLATE_FIELDS,
      terms: false,
    },
  },
  {
    id: "preset_elegant",
    name: "Elegant",
    layout: "centered",
    accent: "#1A1A1A",
    font: "serif",
    fields: {
      ...DEFAULT_TEMPLATE_FIELDS,
      taxNumber: false,
      bankDetails: false,
    },
  },
  {
    id: "preset_stripe",
    name: "Stripe",
    layout: "stripe",
    accent: "#1B4F72",
    font: "rounded",
    fields: { ...DEFAULT_TEMPLATE_FIELDS },
  },
  {
    id: "preset_formal",
    name: "Formal",
    layout: "formal",
    accent: "#1A1A1A",
    font: "times",
    fields: { ...DEFAULT_TEMPLATE_FIELDS },
  },
];

export function isPresetTemplateId(id: string): boolean {
  return id.startsWith("preset_");
}

export function findTemplate(
  id: string,
  customs: InvoiceTemplate[],
): InvoiceTemplate | undefined {
  return (
    PRESET_TEMPLATES.find((t) => t.id === id) ??
    customs.find((t) => t.id === id)
  );
}

export function listTemplates(customs: InvoiceTemplate[]): InvoiceTemplate[] {
  return [...PRESET_TEMPLATES, ...customs];
}
