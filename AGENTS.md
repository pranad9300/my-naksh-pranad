# AGENTS.md — MyNaksh

Rules for humans and coding agents working in this repository.

## Stack

- React Native CLI + TypeScript
- React Navigation (native stack)
- React Native Reanimated + Gesture Handler
- Zustand and Clipboard only through `src/core/adapters/*`

## Folder map (what / where / when)

| Path | Contains | Change when |
| --- | --- | --- |
| `src/app/` | Providers, navigation, `dependencies.ts` | Wiring screens or swapping repository impls |
| `src/core/adapters/` | Vendor adapters (`createStore`, `clipboard`) | Replacing a third-party library |
| `src/core/types/` | Shared models + `as const` enums | Shared shapes change |
| `src/core/factories/` | `messageFactory`, `experienceFactory` | Creation / hydration rules change |
| `src/core/mock-data/` | Session + experience + feedback + send fixtures | Mock catalog changes |
| `src/core/recommendations/` | `resolveExperience` strategy entry | Experience resolution rules change |
| `src/core/components/` | Feature-agnostic UI | Shared UI without feature-only types |
| `src/core/utils/` | Pure helpers (`buildTimeline`, `groupPosition`, `dayLabel`) | Shared list/date logic |
| `src/features/<name>/types/` | Feature-only types | Screen-specific state shapes |
| `src/features/<name>/domain/` | Repository ports | Feature contracts |
| `src/features/<name>/data/` | Data sources + repository impls | Persistence / mock wiring |
| `src/features/<name>/ui/` | `layout.tsx`, view-models, components | Presentation |

## Dependency rules (SOLID / clean architecture)

1. `ui` → `domain` ← `data`. UI never imports `data`. Wire in `src/app/dependencies.ts`.
2. Feature code never imports Zustand / Clipboard packages — use adapters.
3. Shared models, factories, mocks, timeline helpers live in `core/`.
4. Zustand holds **messages only**. Draft, reply, load status stay in view-model `useState`.
5. Recommendation select: repository → factory → `messagesStore.appendMessages`.
6. MVVM: `layout.tsx` renders; split VMs by concern (conversation / composer / recommendations).
7. YAGNI: no DI container, no speculative packages.

## Developing / planning a feature

1. Shared types → `core/types`; feature types → `features/<feature>/types`.
2. Pure helpers → `core/utils`; creation → `core/factories`; fixtures → `core/mock-data`.
3. Add domain port + data + ui VMs; register in navigation + `dependencies.ts`.
4. **Update `README.md`** (and TOC) when structure, architecture, state, recommendations, performance, run, or design decisions change.
5. Memoize virtualized list rows; keep `extraData` free of ephemeral draft state.

## What not to do

- Do not put ephemeral UI (draft / reply / load flags) in Zustand.
- Do not put mock catalogs in feature `domain/`.
- Do not put `buildTimeline` / `groupPosition` in feature domain.
- Do not nest recommendation/feedback presses inside AI/human long-press `Pressable`.
- Do not commit `.cursor/`. Keep `AGENTS.md` and `CLAUDE.md` tracked.

## Verify

```bash
npx tsc --noEmit
npm start
npm run ios   # or npm run android
```
