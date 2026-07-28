# Graph Report - invoice-app  (2026-07-28)

## Corpus Check
- 48 files · ~25,538 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 233 nodes · 345 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a95ba10b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
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
1. `useTheme()` - 24 edges
2. `2. Functional Requirements` - 15 edges
3. `expo` - 13 edges
4. `6. Non-Functional Requirements` - 11 edges
5. `Subscription Plans and Country-Wise Pricing` - 10 edges
6. `Text()` - 9 edges
7. `Screen()` - 8 edges
8. `applyElevation()` - 6 edges
9. `EmptyState()` - 6 edges
10. `FloatingAddButton()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `RootNavigator()` --calls--> `useTheme()`  [EXTRACTED]
  src/app/_layout.tsx → src/shared/design-system/useTheme.ts
- `TabsLayout()` --calls--> `useTheme()`  [EXTRACTED]
  src/app/(tabs)/_layout.tsx → src/shared/design-system/useTheme.ts
- `Button()` --calls--> `useTheme()`  [EXTRACTED]
  src/shared/design-system/components/Button.tsx → src/shared/design-system/useTheme.ts
- `Screen()` --calls--> `useTheme()`  [EXTRACTED]
  src/shared/design-system/components/Screen.tsx → src/shared/design-system/useTheme.ts
- `Text()` --calls--> `useTheme()`  [EXTRACTED]
  src/shared/design-system/components/Text.tsx → src/shared/design-system/useTheme.ts

## Import Cycles
- None detected.

## Communities (16 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (30): 1. Purpose, 2.10 Reports, 2.11 Purchase Management, 2.12 Purchase Order Management, 2.13 CSV Import and Export, 2.14 Subscription and In-App Purchase, 2.1 Business Profile, 2.2 Catalogue and Item Management (+22 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (19): RootNavigator(), colors, darkTheme, lightTheme, Theme, ThemeMode, themes, Props (+11 more)

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (22): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, expo, android (+14 more)

### Community 4 - "Community 4"
Cohesion: 0.10
Nodes (20): dependencies, date-fns, expo, expo-constants, expo-linking, expo-navigation-bar, expo-router, expo-status-bar (+12 more)

### Community 5 - "Community 5"
Cohesion: 0.15
Nodes (10): Button(), ButtonVariant, Props, Props, Screen(), Props, Text(), TextVariant (+2 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (14): 1. Plan Overview, 2. Billing Duration, 3. Recommended Pricing by Country, 4. Pricing Screen Layout, 5. Country and Currency Detection, 6. Taxes, 7. SMS, WhatsApp, and Payment Charges, 8. Additional Users (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (14): devDependencies, @types/react, @types/uuid, typescript, main, name, packageManager, private (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.09
Nodes (22): CreateInvoiceSheet(), Props, styles, IconButton(), useTheme(), TabsLayout(), BottomSheet(), Props (+14 more)

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (5): compilerOptions, paths, strict, extends, @/*

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (11): 6.10 Audit and Monitoring, 6.1 Performance, 6.2 Security, 6.3 Privacy, 6.4 Reliability, 6.5 Scalability, 6.6 Usability, 6.7 Accessibility (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.33
Nodes (4): IconButtonSize, Props, applyElevation(), ElevationLevel

### Community 15 - "Community 15"
Cohesion: 0.33
Nodes (5): Architecture, Docs, Invoice App, Setup, Stack

## Knowledge Gaps
- **129 isolated node(s):** `expo@claude-plugins-official`, `name`, `slug`, `version`, `orientation` (+124 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useTheme()` connect `Community 8` to `Community 1`, `Community 13`, `Community 5`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 4` to `Community 7`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `expo@claude-plugins-official`, `name`, `slug` to the rest of the system?**
  _129 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.13257575757575757 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._