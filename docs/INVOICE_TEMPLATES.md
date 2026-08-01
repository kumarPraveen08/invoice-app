# Adding invoice templates

Predesigned templates live in code. User customs are stored in settings MMKV and cloned from a preset when someone taps **Customize**.

## Where to edit

| Piece | File |
| --- | --- |
| Preset list + accents/fonts/fields labels | `src/features/settings/templateConstants.ts` |
| Template shape (`InvoiceTemplate`) | `src/features/settings/types.ts` |
| Preview / A4 paper render | `src/features/settings/components/InvoiceTemplatePreview.tsx` |
| Layout variants (`classic` \| `modern` \| `compact`) | same preview file |

Default install template id: `preset_base` (`DEFAULT_TEMPLATE_ID`).

## Add a new predesigned template

1. Open `templateConstants.ts`.
2. Append an entry to `PRESET_TEMPLATES`.

```ts
{
  id: 'preset_your_name', // must start with "preset_"
  name: 'Your Name',      // shown in gallery + send picker
  layout: 'classic',      // 'classic' | 'modern' | 'compact'
  accent: '#1B4F72',      // paper accent hex
  font: 'sans',           // 'sans' | 'serif' | 'mono'
  fields: {
    logo: true,
    businessAddress: true,
    taxNumber: true,
    dueDate: true,
    notes: true,
    terms: true,
    bankDetails: true,
    signature: true,
  },
},
```

3. Prefer reusing `DEFAULT_TEMPLATE_FIELDS` and overriding only what differs:

```ts
fields: {
  ...DEFAULT_TEMPLATE_FIELDS,
  terms: false,
  taxNumber: false,
},
```

4. Optional: add the accent to `TEMPLATE_ACCENTS` if it should appear in the editor swatch row.
5. Run the app → **Settings → Invoice templates**. The new card appears automatically (presets are not persisted; they always come from this list).

## Rules

- Preset ids **must** start with `preset_` (`isPresetTemplateId`).
- Presets are read-only in the editor. **Customize** clones into `invoiceTemplates.customs`.
- Free-plan watermark + footer are controlled by `FREE_PLAN_BRANDING` in `templateConstants.ts`.
- Preview paper uses A4 portrait ratio (`210 / 297`) in `InvoiceTemplatePreview`.

## New layout kind (optional)

If `classic` / `modern` / `compact` are not enough:

1. Extend `InvoiceTemplateLayout` in `types.ts`.
2. Add a label in `TEMPLATE_LAYOUTS`.
3. Teach `InvoiceTemplatePreview` how to render the new layout.
4. Point at least one preset at it.

## Checklist

- [ ] Unique `preset_*` id
- [ ] Clear `name`
- [ ] Layout + accent + font look correct on A4 preview
- [ ] Field flags match the design intent
- [ ] Gallery card + send-time template picker show the new option
