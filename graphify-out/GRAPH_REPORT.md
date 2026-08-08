# Graph Report - invoice-app  (2026-08-08)

## Corpus Check
- 155 files · ~56,138 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 673 nodes · 1692 edges · 33 communities (29 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f283af5b`
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
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 33|Community 33]]

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 113 edges
2. `useSettingsStore` - 52 edges
3. `Text()` - 47 edges
4. `SettingsScroll()` - 29 edges
5. `Icon()` - 26 edges
6. `useClientsStore` - 19 edges
7. `formatMoney()` - 18 edges
8. `useCatalogueStore` - 17 edges
9. `useInvoicesStore` - 17 edges
10. `SettingsGroup()` - 17 edges

## Surprising Connections (you probably didn't know these)
- `DetailRow()` --calls--> `useTheme()`  [EXTRACTED]
  src/features/catalogue/screens/CatalogueDetailScreen.tsx → src/shared/design-system/useTheme.ts
- `CompactInput()` --calls--> `useTheme()`  [EXTRACTED]
  src/features/invoices/screens/NewInvoiceScreen.tsx → src/shared/design-system/useTheme.ts
- `MonthBars()` --calls--> `useTheme()`  [EXTRACTED]
  src/features/reports/screens/ReportsScreen.tsx → src/shared/design-system/useTheme.ts
- `MetricRow()` --calls--> `useTheme()`  [EXTRACTED]
  src/features/reports/screens/ReportsScreen.tsx → src/shared/design-system/useTheme.ts
- `AssetRow()` --calls--> `useTheme()`  [EXTRACTED]
  src/features/settings/screens/BrandingScreen.tsx → src/shared/design-system/useTheme.ts

## Import Cycles
- 1-file cycle: `src/app/auth/index.tsx -> src/app/auth/index.tsx`
- 1-file cycle: `src/app/settings/index.tsx -> src/app/settings/index.tsx`
- 4-file cycle: `src/features/customers/index.ts -> src/features/customers/screens/ClientDetailScreen.tsx -> src/features/invoices/index.ts -> src/features/invoices/screens/NewInvoiceScreen.tsx -> src/features/customers/index.ts`

## Communities (33 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (41): 1. Purpose, 2.10 Reports, 2.11 Purchase Management, 2.12 Purchase Order Management, 2.13 CSV Import and Export, 2.14 Subscription and In-App Purchase, 2.1 Business Profile, 2.2 Catalogue and Item Management (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (27): colors, createTheme(), darkTheme, lightTheme, Theme, ThemeMode, ThemePreference, themes (+19 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (25): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, expo (+17 more)

### Community 3 - "Community 3"
Cohesion: 0.13
Nodes (17): ClientAvatar(), hashName(), initialOf(), Props, styles, ClientRow(), Props, styles (+9 more)

### Community 4 - "Community 4"
Cohesion: 0.05
Nodes (41): dependencies, date-fns, expo, expo-auth-session, expo-constants, expo-contacts, expo-dev-client, expo-document-picker (+33 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (51): fontFamily(), InvoiceTemplatePreview(), Props, SAMPLE_LINES, styles, FieldProps, SettingsField(), styles (+43 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (14): 1. Plan Overview, 2. Billing Duration, 3. Recommended Pricing by Country, 4. Pricing Screen Layout, 5. Country and Currency Detection, 6. Taxes, 7. SMS, WhatsApp, and Payment Charges, 8. Additional Users (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (52): InvoiceFilters(), Props, InvoiceRow(), Props, STATUS_ICON, styles, SettingsGroup(), CLIENTS (+44 more)

### Community 8 - "Community 8"
Cohesion: 0.13
Nodes (14): Option, Props, SettingsSelect(), styles, Text(), Props, SheetAction, styles (+6 more)

### Community 9 - "Community 9"
Cohesion: 0.20
Nodes (9): compilerOptions, baseUrl, ignoreDeprecations, jsx, paths, strict, extends, include (+1 more)

### Community 12 - "Community 12"
Cohesion: 0.10
Nodes (15): OverviewGuide(), Props, STAGE, styles, { width: SCREEN_W, height: SCREEN_H }, OVERVIEW_SLIDES, OverviewSlide, OverviewTag (+7 more)

### Community 13 - "Community 13"
Cohesion: 0.20
Nodes (12): Button(), ButtonVariant, Props, Icon(), IconName, ICONS, Props, IconButton() (+4 more)

### Community 15 - "Community 15"
Cohesion: 0.33
Nodes (5): Architecture, Docs, Invoice App, Setup, Stack

### Community 16 - "Community 16"
Cohesion: 0.06
Nodes (38): CatalogueState, useCatalogueStore, CatalogueItem, SAMPLE_CATALOGUE, CatalogueRow(), Props, styles, SettingsGroupProps (+30 more)

### Community 18 - "Community 18"
Cohesion: 0.26
Nodes (9): AuthLayout(), MoreCreateSheet(), Props, useTheme(), SettingsLayout(), CREATE_PATH, headerIcon(), TabsLayout() (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): RootNavigator(), SKIP_DEFER, GoogleSignInButton(), Props, styles, AuthContext, AuthContextValue, AuthProvider() (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.47
Nodes (5): DateField(), displayLabel(), Props, styles, toDate()

### Community 21 - "Community 21"
Cohesion: 0.17
Nodes (11): CREATE_ROUTES, FloatingTabBarProps, FONT_ICONS, ICONS, IconSource, MenuAction, ROUTE_TAB, styles (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.21
Nodes (9): applyElevation(), ElevationLevel, FloatingTabBar(), SnackbarHost(), styles, SnackbarAction, SnackbarPayload, SnackbarState (+1 more)

### Community 23 - "Community 23"
Cohesion: 0.29
Nodes (6): Add a new predesigned template, Adding invoice templates, Checklist, New layout kind (optional), Rules, Where to edit

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (6): FilterChipItem, FilterChipRow(), FontIcon, IconSource, Props, styles

### Community 25 - "Community 25"
Cohesion: 0.25
Nodes (4): Props, Screen(), SignatureDrawScreen(), styles

### Community 26 - "Community 26"
Cohesion: 0.16
Nodes (16): CLOSED, DateRange, formatRangeLabel(), invoicesInPeriod(), MonthBar, monthlyCollected(), parseDateInput(), periodRange() (+8 more)

### Community 28 - "Community 28"
Cohesion: 0.20
Nodes (9): devDependencies, @types/react, @types/uuid, typescript, main, name, packageManager, private (+1 more)

### Community 29 - "Community 29"
Cohesion: 0.40
Nodes (5): scripts, android, ios, start, web

### Community 30 - "Community 30"
Cohesion: 0.50
Nodes (4): buildFromSource, android, expo, autolinking

### Community 31 - "Community 31"
Cohesion: 0.50
Nodes (3): COPY, Kind, LegalScreen()

### Community 33 - "Community 33"
Cohesion: 0.18
Nodes (10): DeferredMount(), Props, ScreenLoading(), styles, Props, SearchField(), styles, Props (+2 more)

## Knowledge Gaps
- **270 isolated node(s):** `expo@claude-plugins-official`, `typescript.tsdk`, `typescript.enablePromptUseWorkspaceTsdk`, `name`, `slug` (+265 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useTheme()` connect `Community 18` to `Community 1`, `Community 33`, `Community 3`, `Community 5`, `Community 7`, `Community 8`, `Community 12`, `Community 13`, `Community 16`, `Community 17`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 24`, `Community 25`, `Community 26`, `Community 31`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Why does `Text()` connect `Community 8` to `Community 1`, `Community 33`, `Community 3`, `Community 5`, `Community 7`, `Community 12`, `Community 13`, `Community 16`, `Community 17`, `Community 18`, `Community 19`, `Community 20`, `Community 22`, `Community 24`, `Community 25`, `Community 26`, `Community 31`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `useSettingsStore` connect `Community 7` to `Community 1`, `Community 5`, `Community 12`, `Community 16`, `Community 19`, `Community 25`, `Community 26`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **What connects `expo@claude-plugins-official`, `typescript.tsdk`, `typescript.enablePromptUseWorkspaceTsdk` to the rest of the system?**
  _270 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.10853658536585366 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._