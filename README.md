# Invoice App

Expo (React Native) app for managing invoices and customers. Runs on iOS, Android, and web.

## Stack

- Expo SDK 57 + Expo Router
- React Native / React Native Web
- TypeScript
- pnpm

## Setup

```bash
pnpm install
pnpm start
```

Then press `i` (iOS), `a` (Android), or `w` (web).

| Script | Command |
| --- | --- |
| Start | `pnpm start` |
| iOS | `pnpm ios` |
| Android | `pnpm android` |
| Web | `pnpm web` |

## Architecture

Feature-based (vertical slice). Each domain owns its UI, hooks, and screens. Routes stay thin.

```
src/
  app/                 # Expo Router — route shells only
  features/
    invoices/          # components, hooks, screens, index.ts
    customers/
  shared/
    ui/                # reusable UI primitives
    lib/               # helpers
    constants/
```

**Rules**

- `app/` maps URLs to feature screens (re-exports)
- Import a feature through its public `index.ts` (`@/features/invoices`)
- Features may use `shared/`; `shared/` never imports features
- Cross-feature use goes through the other feature’s public API

Path alias: `@/*` → `src/*`

## Docs

Product requirements live in [`docs/REQUIREMENT.md`](docs/REQUIREMENT.md).
