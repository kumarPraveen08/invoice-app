# Graph Report - invoice-app  (2026-07-22)

## Corpus Check
- 16 files · ~22,609 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 134 nodes · 121 edges · 17 communities (15 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3818822d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]

## God Nodes (most connected - your core abstractions)
1. `2. Functional Requirements` - 15 edges
2. `expo` - 12 edges
3. `6. Non-Functional Requirements` - 11 edges
4. `Subscription Plans and Country-Wise Pricing` - 10 edges
5. `adaptiveIcon` - 5 edges
6. `scripts` - 5 edges
7. `4. User Roles and Permissions` - 5 edges
8. `7. Recommended Development Phases` - 5 edges
9. `3. Recommended Pricing by Country` - 5 edges
10. `android` - 3 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (17 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.12
Nodes (15): 1. Purpose, 3. Suggested Plan Features, 4. User Roles and Permissions, 5. Business Rules, 7. Recommended Development Phases, Administrator, Business Owner, Customer (+7 more)

### Community 2 - "Community 2"
Cohesion: 0.13
Nodes (14): expo, icon, ios, name, orientation, plugins, scheme, slug (+6 more)

### Community 4 - "Community 4"
Cohesion: 0.11
Nodes (18): dependencies, date-fns, expo, expo-constants, expo-linking, expo-router, expo-status-bar, @hookform/resolvers (+10 more)

### Community 5 - "Community 5"
Cohesion: 0.13
Nodes (15): 2.10 Reports, 2.11 Purchase Management, 2.12 Purchase Order Management, 2.13 CSV Import and Export, 2.14 Subscription and In-App Purchase, 2.1 Business Profile, 2.2 Catalogue and Item Management, 2.3 Customer Management (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (14): 1. Plan Overview, 2. Billing Duration, 3. Recommended Pricing by Country, 4. Pricing Screen Layout, 5. Country and Currency Detection, 6. Taxes, 7. SMS, WhatsApp, and Payment Charges, 8. Additional Users (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.13
Nodes (14): devDependencies, @types/react, @types/uuid, typescript, main, name, packageManager, private (+6 more)

### Community 9 - "Community 9"
Cohesion: 0.33
Nodes (5): compilerOptions, paths, strict, extends, @/*

### Community 12 - "Community 12"
Cohesion: 0.18
Nodes (11): 6.10 Audit and Monitoring, 6.1 Performance, 6.2 Security, 6.3 Privacy, 6.4 Reliability, 6.5 Scalability, 6.6 Usability, 6.7 Accessibility (+3 more)

### Community 13 - "Community 13"
Cohesion: 0.29
Nodes (7): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, predictiveBackGestureEnabled, android

## Knowledge Gaps
- **98 isolated node(s):** `expo@claude-plugins-official`, `name`, `slug`, `version`, `orientation` (+93 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `2. Functional Requirements` connect `Community 5` to `Community 0`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Community 4` to `Community 7`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `6. Non-Functional Requirements` connect `Community 12` to `Community 0`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `expo@claude-plugins-official`, `name`, `slug` to the rest of the system?**
  _98 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._