# Graph Report - invoice-app  (2026-08-02)

## Corpus Check
- 123 files · ~43,436 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 509 nodes · 1239 edges · 24 communities (22 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `672f273f`
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
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 93 edges
2. `useSettingsStore` - 36 edges
3. `Text()` - 34 edges
4. `SettingsScroll()` - 27 edges
5. `useClientsStore` - 19 edges
6. `useCatalogueStore` - 17 edges
7. `useInvoicesStore` - 17 edges
8. `formatMoney()` - 16 edges
9. `SettingsGroup()` - 16 edges
10. `2. Functional Requirements` - 15 edges

## Surprising Connections (you probably didn't know these)
- `ToolsScreen()` --calls--> `useTheme()`  [EXTRACTED]
  src/app/(tabs)/tools.tsx → src/shared/design-system/useTheme.ts
- `DetailRow()` --calls--> `useTheme()`  [EXTRACTED]
  src/features/catalogue/screens/CatalogueDetailScreen.tsx → src/shared/design-system/useTheme.ts
- `CompactInput()` --calls--> `useTheme()`  [EXTRACTED]
  src/features/invoices/screens/NewInvoiceScreen.tsx → src/shared/design-system/useTheme.ts
- `ChipRow()` --calls--> `useTheme()`  [EXTRACTED]
  src/features/reports/screens/ReportsScreen.tsx → src/shared/design-system/useTheme.ts
- `MonthBars()` --calls--> `useTheme()`  [EXTRACTED]
  src/features/reports/screens/ReportsScreen.tsx → src/shared/design-system/useTheme.ts

## Import Cycles
- 1-file cycle: `src/app/settings/index.tsx -> src/app/settings/index.tsx`
- 4-file cycle: `src/features/customers/index.ts -> src/features/customers/screens/ClientDetailScreen.tsx -> src/features/invoices/index.ts -> src/features/invoices/screens/NewInvoiceScreen.tsx -> src/features/customers/index.ts`

## Communities (24 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (41): 1. Purpose, 2.10 Reports, 2.11 Purchase Management, 2.12 Purchase Order Management, 2.13 CSV Import and Export, 2.14 Subscription and In-App Purchase, 2.1 Business Profile, 2.2 Catalogue and Item Management (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (38): ButtonVariant, Props, IconButton(), IconButtonSize, Props, Props, Screen(), Props (+30 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (25): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, expo (+17 more)

### Community 3 - "Community 3"
Cohesion: 0.14
Nodes (14): CatalogueState, useCatalogueStore, CatalogueItem, SAMPLE_CATALOGUE, CatalogueRow(), Props, styles, CatalogueDetailScreen() (+6 more)

### Community 4 - "Community 4"
Cohesion: 0.04
Nodes (44): dependencies, date-fns, expo, expo-constants, expo-contacts, expo-dev-client, expo-document-picker, expo-file-system (+36 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (35): FieldProps, SettingsField(), styles, Props, SettingsScroll(), styles, mmkv, mmkvStorage (+27 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (14): 1. Plan Overview, 2. Billing Duration, 3. Recommended Pricing by Country, 4. Pricing Screen Layout, 5. Country and Currency Detection, 6. Taxes, 7. SMS, WhatsApp, and Payment Charges, 8. Additional Users (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (46): InvoiceFilters(), Props, styles, InvoiceRow(), Props, STATUS_ICON, styles, SettingsGroup() (+38 more)

### Community 8 - "Community 8"
Cohesion: 0.16
Nodes (11): ActionSheet(), Props, SheetAction, styles, BottomSheet(), Props, styles, PickerOption (+3 more)

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (5): compilerOptions, paths, strict, extends, @/*

### Community 12 - "Community 12"
Cohesion: 0.19
Nodes (11): RootNavigator(), MoreCreateSheet(), Props, styles, useTheme(), AssetRow(), SettingsLayout(), CREATE_PATH (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.14
Nodes (18): CLOSED, DateRange, formatRangeLabel(), invoicesInPeriod(), MonthBar, monthlyCollected(), parseDateInput(), periodRange() (+10 more)

### Community 15 - "Community 15"
Cohesion: 0.33
Nodes (5): Architecture, Docs, Invoice App, Setup, Stack

### Community 16 - "Community 16"
Cohesion: 0.10
Nodes (21): Button(), ClientRow(), Props, styles, ClientsState, useClientsStore, Client, SAMPLE_CLIENTS (+13 more)

### Community 17 - "Community 17"
Cohesion: 0.40
Nodes (4): Option, Props, SettingsSelect(), styles

### Community 18 - "Community 18"
Cohesion: 0.19
Nodes (10): Props, SearchField(), styles, Props, styles, SwipeableRow(), IconPair, Props (+2 more)

### Community 19 - "Community 19"
Cohesion: 0.27
Nodes (6): SettingsGroupProps, SettingsRow(), SettingsRowProps, styles, SubscriptionScreen(), ToolsScreen()

### Community 20 - "Community 20"
Cohesion: 0.31
Nodes (7): applyElevation(), SnackbarHost(), styles, SnackbarAction, SnackbarPayload, SnackbarState, useSnackbarStore

### Community 21 - "Community 21"
Cohesion: 0.25
Nodes (4): Text(), EmptyState(), Props, styles

### Community 22 - "Community 22"
Cohesion: 0.47
Nodes (5): DateField(), displayLabel(), Props, styles, toDate()

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (5): CREATE_ROUTES, FloatingTabBarProps, ICONS, ROUTE_TAB, styles

## Knowledge Gaps
- **203 isolated node(s):** `expo@claude-plugins-official`, `name`, `slug`, `version`, `orientation` (+198 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useTheme()` connect `Community 12` to `Community 1`, `Community 3`, `Community 5`, `Community 7`, `Community 8`, `Community 13`, `Community 16`, `Community 17`, `Community 18`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 23`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Why does `useSettingsStore` connect `Community 5` to `Community 1`, `Community 3`, `Community 13`, `Community 7`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `Text()` connect `Community 21` to `Community 1`, `Community 3`, `Community 5`, `Community 7`, `Community 8`, `Community 12`, `Community 13`, `Community 16`, `Community 17`, `Community 18`, `Community 19`, `Community 20`, `Community 22`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `expo@claude-plugins-official`, `name`, `slug` to the rest of the system?**
  _203 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06892655367231638 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._