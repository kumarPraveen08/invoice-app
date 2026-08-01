# Graph Report - invoice-app  (2026-08-02)

## Corpus Check
- 120 files · ~42,094 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 489 nodes · 1166 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `684b071b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 89 edges
2. `useSettingsStore` - 32 edges
3. `Text()` - 32 edges
4. `SettingsScroll()` - 26 edges
5. `useClientsStore` - 19 edges
6. `useCatalogueStore` - 17 edges
7. `useInvoicesStore` - 17 edges
8. `formatMoney()` - 16 edges
9. `SettingsGroup()` - 16 edges
10. `2. Functional Requirements` - 15 edges

## Surprising Connections (you probably didn't know these)
- `HeaderIcon()` --calls--> `useTheme()`  [EXTRACTED]
  src/app/(tabs)/_layout.tsx → src/shared/design-system/useTheme.ts
- `TabsLayout()` --calls--> `useTheme()`  [EXTRACTED]
  src/app/(tabs)/_layout.tsx → src/shared/design-system/useTheme.ts
- `RootNavigator()` --calls--> `useTheme()`  [EXTRACTED]
  src/app/_layout.tsx → src/shared/design-system/useTheme.ts
- `DetailRow()` --calls--> `useTheme()`  [EXTRACTED]
  src/features/catalogue/screens/CatalogueDetailScreen.tsx → src/shared/design-system/useTheme.ts
- `CompactInput()` --calls--> `useTheme()`  [EXTRACTED]
  src/features/invoices/screens/NewInvoiceScreen.tsx → src/shared/design-system/useTheme.ts

## Import Cycles
- 1-file cycle: `src/app/settings/index.tsx -> src/app/settings/index.tsx`
- 4-file cycle: `src/features/customers/index.ts -> src/features/customers/screens/ClientDetailScreen.tsx -> src/features/invoices/index.ts -> src/features/invoices/screens/NewInvoiceScreen.tsx -> src/features/customers/index.ts`

## Communities (16 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (41): 1. Purpose, 2.10 Reports, 2.11 Purchase Management, 2.12 Purchase Order Management, 2.13 CSV Import and Export, 2.14 Subscription and In-App Purchase, 2.1 Business Profile, 2.2 Catalogue and Item Management (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (38): RootNavigator(), ButtonVariant, Props, IconButton(), IconButtonSize, Props, Props, TextVariant (+30 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (25): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, expo (+17 more)

### Community 3 - "Community 3"
Cohesion: 0.18
Nodes (12): CatalogueState, useCatalogueStore, CatalogueItem, SAMPLE_CATALOGUE, CatalogueRow(), Props, styles, CatalogueDetailScreen() (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (43): dependencies, date-fns, expo, expo-constants, expo-contacts, expo-dev-client, expo-document-picker, expo-file-system (+35 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (39): Button(), FieldProps, SettingsField(), styles, Props, SettingsScroll(), styles, mmkv (+31 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (14): 1. Plan Overview, 2. Billing Duration, 3. Recommended Pricing by Country, 4. Pricing Screen Layout, 5. Country and Currency Detection, 6. Taxes, 7. SMS, WhatsApp, and Payment Charges, 8. Additional Users (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (49): InvoiceFilters(), Props, styles, InvoiceRow(), invoiceSummary(), Props, STATUS_ICON, styles (+41 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (31): MoreCreateSheet(), Props, styles, Option, Props, SettingsSelect(), styles, Text() (+23 more)

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (5): compilerOptions, paths, strict, extends, @/*

### Community 15 - "Community 15"
Cohesion: 0.33
Nodes (5): Architecture, Docs, Invoice App, Setup, Stack

### Community 16 - "Community 16"
Cohesion: 0.09
Nodes (30): ClientRow(), Props, styles, Props, Screen(), SettingsGroup(), SettingsGroupProps, SettingsRow() (+22 more)

### Community 17 - "Community 17"
Cohesion: 0.09
Nodes (20): InvoiceLine, parseCsv(), toCsv(), createId(), CompactInput(), defaultDueIso(), emptyLine(), FormErrors (+12 more)

## Knowledge Gaps
- **196 isolated node(s):** `expo@claude-plugins-official`, `name`, `slug`, `version`, `orientation` (+191 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useTheme()` connect `Community 16` to `Community 1`, `Community 3`, `Community 5`, `Community 7`, `Community 8`, `Community 17`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Why does `useSettingsStore` connect `Community 5` to `Community 16`, `Community 17`, `Community 3`, `Community 7`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `Text()` connect `Community 8` to `Community 1`, `Community 3`, `Community 5`, `Community 7`, `Community 16`, `Community 17`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `expo@claude-plugins-official`, `name`, `slug` to the rest of the system?**
  _196 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06604324956165984 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._