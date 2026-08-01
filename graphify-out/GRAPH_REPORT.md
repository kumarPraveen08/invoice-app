# Graph Report - invoice-app  (2026-08-01)

## Corpus Check
- 68 files · ~27,867 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 290 nodes · 495 edges · 16 communities (13 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ea66cce3`
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

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 36 edges
2. `2. Functional Requirements` - 15 edges
3. `useSettingsStore` - 14 edges
4. `expo` - 13 edges
5. `Text()` - 12 edges
6. `6. Non-Functional Requirements` - 11 edges
7. `Subscription Plans and Country-Wise Pricing` - 10 edges
8. `SettingsScroll()` - 9 edges
9. `Screen()` - 9 edges
10. `SettingsField()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `TabsLayout()` --calls--> `useTheme()`  [EXTRACTED]
  src/app/(tabs)/_layout.tsx → src/shared/design-system/useTheme.ts
- `RootNavigator()` --calls--> `useTheme()`  [EXTRACTED]
  src/app/_layout.tsx → src/shared/design-system/useTheme.ts
- `ToolsScreen()` --calls--> `useTheme()`  [EXTRACTED]
  src/app/(tabs)/tools.tsx → src/shared/design-system/useTheme.ts
- `SettingsLayout()` --calls--> `useTheme()`  [EXTRACTED]
  src/app/settings/_layout.tsx → src/shared/design-system/useTheme.ts
- `CreateInvoiceSheet()` --calls--> `useTheme()`  [EXTRACTED]
  src/features/invoices/components/CreateInvoiceSheet.tsx → src/shared/design-system/useTheme.ts

## Import Cycles
- 1-file cycle: `src/app/settings/index.tsx -> src/app/settings/index.tsx`

## Communities (16 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (26): 1. Purpose, 3. Suggested Plan Features, 4. User Roles and Permissions, 5. Business Rules, 6.10 Audit and Monitoring, 6.1 Performance, 6.2 Security, 6.3 Privacy (+18 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (20): RootNavigator(), colors, darkTheme, lightTheme, Theme, ThemeMode, themes, Props (+12 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (22): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, expo, android (+14 more)

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (23): dependencies, date-fns, expo, expo-constants, expo-linking, expo-navigation-bar, expo-router, expo-status-bar (+15 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (29): ChoiceProps, FieldProps, SettingsChoiceGroup(), SettingsField(), styles, Props, SettingsScroll(), styles (+21 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (14): 1. Plan Overview, 2. Billing Duration, 3. Recommended Pricing by Country, 4. Pricing Screen Layout, 5. Country and Currency Detection, 6. Taxes, 7. SMS, WhatsApp, and Payment Charges, 8. Additional Users (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (15): 2.10 Reports, 2.11 Purchase Management, 2.12 Purchase Order Management, 2.13 CSV Import and Export, 2.14 Subscription and In-App Purchase, 2.1 Business Profile, 2.2 Catalogue and Item Management, 2.3 Customer Management (+7 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (16): CreateInvoiceSheet(), Props, styles, TabsLayout(), BottomSheet(), Props, styles, EmptyState() (+8 more)

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (5): compilerOptions, paths, strict, extends, @/*

### Community 12 - "Community 12"
Cohesion: 0.13
Nodes (14): devDependencies, @types/react, @types/uuid, typescript, main, name, packageManager, private (+6 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (23): Button(), ButtonVariant, Props, IconButton(), IconButtonSize, Props, Props, Screen() (+15 more)

### Community 15 - "Community 15"
Cohesion: 0.33
Nodes (5): Architecture, Docs, Invoice App, Setup, Stack

## Knowledge Gaps
- **141 isolated node(s):** `expo@claude-plugins-official`, `name`, `slug`, `version`, `orientation` (+136 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useTheme()` connect `Community 13` to `Community 8`, `Community 1`, `Community 5`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 4` to `Community 12`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `2. Functional Requirements` connect `Community 7` to `Community 0`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `expo@claude-plugins-official`, `name`, `slug` to the rest of the system?**
  _141 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12299465240641712 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._