# MyNaksh — AI Conversation Experience

React Native (CLI) TypeScript app: composable astrology conversation with multi-speaker timeline, dynamic recommendation experiences, and production chat interactions.

## Table of Contents

- [Overview](#overview)
- [How to run](#how-to-run)
- [Project structure](#project-structure)
- [Component architecture](#component-architecture)
- [State management](#state-management)
- [Recommendation rendering strategy](#recommendation-rendering-strategy)
- [Performance considerations](#performance-considerations)
- [Design decisions](#design-decisions)
- [Trade-offs made due to time constraints](#trade-offs-made-due-to-time-constraints)

## Overview

One conversation timeline mixes **system**, **user**, **AI**, and **human astrologer** messages. AI responses surface recommendation cards. The user selects an experience; factories append follow-up messages of the correct speaker types (with a short typing row first). After consultation (or the `astrologer` send keyword), mock human replies continue for a few turns, then AI resumes. Part B covers long-press Reply / Copy / Delete on AI and astrologer text, like/dislike chips, and optimistic send with Failed + Retry.

## How to run

Requirements: Node `>= 22.11.0`, Xcode (iOS) and/or Android SDK.

```bash
npm install

# iOS pods (first time / after native dependency changes)
cd ios && bundle install && bundle exec pod install && cd ..

# Metro
npm start

# In another terminal
npm run ios
# or
npm run android
```

Typecheck:

```bash
npx tsc --noEmit
```

**Screen recording (submission)**

- [`demos/MyNaksh_EdgeCases_Demo.mp4`](demos/MyNaksh_EdgeCases_Demo.mp4) — ~3.7 min Part A/B edge-case walkthrough  
- Chapter list: [`demos/DEMO.md`](demos/DEMO.md)

**Demo tips**

- Seed opens on **Today** through the first AI + all five reco cards (human joins after you tap)
- Timestamps under messages (`3:45 PM` style)
- Tap gemstone / tarot / consultation / article / promotion — typing dots, then mock follow-ups
- Like or Dislike (+ reason chips) — loader, then system/AI ack from mock-data
- Long-press AI or Astrologer text: Reply / Copy / Delete (✕ closes the actions modal)
- After handoff: ask twice → human replies; third ask → AI resumes
- Send `fail` for Failed + Retry; include `astrologer` for human handoff
- Emulator Gboard hamburger/teal toolbar overlays are keyboard chrome, not app UI

## Project structure

```text
src/
  app/                              # composition root (providers, nav, dependencies)
  core/
    adapters/                       # Zustand createStore, clipboard
    types/                          # MessageType, RecommendationType (as const enums)
    factories/                      # messageFactory, experienceFactory
    mock-data/                      # sessions, experiences, feedback, send scenarios
    recommendations/                # resolveExperience strategy entry
    components/                     # Screen, HorizontalCardList
    utils/                          # dayLabel, groupPosition, buildTimeline,
                                    # formatMessageTime, delay, appendWithTyping
  features/
    conversation/                   # timeline, composer, feedback, AI actions (MVVM)
      ui/components/                # MessageBubble, TypingIndicator, MessageActionsModal, …
    recommendations/                # experience port + card registry + select VM
```

## Component architecture

- **`layout.tsx`** — composes three view-models; FlatList timeline; scrolls on ready + new messages; mounts `MessageActionsModal`
- **`useConversationViewModel`** — load status (local), timeline, feedback side effects, AI actions modal state (not stock Alert)
- **`useComposerViewModel`** — draft / reply (local), optimistic send + retry
- **`useRecommendationViewModel`** — card select → typing loader → resolve experience → append
- **`MessageBubble`** — timestamps via `formatMessageTime`; long-press on **AI and human text**; reco strip + feedback outside that press target
- **`HorizontalCardList`** — fixed-height horizontal FlatList for reliable presses
- **`TypingIndicator`** — compact AI typing row while mock follow-ups load
- **`Composer`** — `useSafeAreaInsets` bottom padding so input clears the system nav bar

## State management

| State | Location |
| --- | --- |
| `messages` (incl. transient `isTyping` rows) | `messagesStore` via `createStore` adapter only |
| `draft`, `replyToId` | `useState` in composer VM |
| `loadStatus`, `loadError`, `messageActions` | `useState` in conversation VM |

Ephemeral UI (draft, load flags, modal actions) is not stored in Zustand. Clipboard uses `core/adapters/clipboard`.

## Recommendation rendering strategy

1. AI surfaces cards (UI registry in `features/recommendations/ui/registry.tsx`)
2. User selects a card
3. `RecommendationExperienceRepository` → `resolveExperience` → `experienceFactory` → `messageFactory.hydrateTemplate`
4. Shared `appendWithTyping` → `messagesStore.appendMessages`

The cold-start seed’s first AI message carries all five types (gemstone, tarot, consultation, article, promotion). Unknown types use a fallback experience. Consultation / send-keyword handoff appends system + human rows, arms a short human-reply queue in the mock data source, then resumes with an AI follow-up once that queue is empty.

Open/closed: new type = mock templates + registry card + optional factory branch.

## Performance considerations

- Virtualized `FlatList`, memoized message rows and reco cards
- `extraData` = messages only (draft keystrokes do not resubscribe the list)
- Fixed-height recommendation strip (~100) so AI bubbles stay compact
- Horizontal reco `FlatList` with `keyboardShouldPersistTaps="handled"` and `nestedScrollEnabled`
- Auto-scroll when load becomes ready and when message count grows
- `maintainVisibleContentPosition` on delete

## Design decisions

- **One timeline, many speakers** — modes are message types inside one session, not a separate “pick chat type” screen
- **AI surfaces, user selects** — cards drive the next experience; factories append typed messages
- **Const enum objects + factories + strategy registry** — LLD without a DI container
- **Mocks in `core/mock-data`** — shared fixtures for sessions, experiences, feedback, send
- **Split VMs + thin messages store** — modern MVVM; Zustand holds conversation data only
- **React Native CLI + FlatList + Zustand adapter** — assessment stack; vendors swappable behind adapters

Timeboxed cuts (what we skipped for the 3-hour bound) live in the next section.

## Trade-offs made due to time constraints

Inside the **3-hour** assessment window we prioritized Part A’s composable conversation + recommendation framework, Part B interactions, and a 2–5 minute demo video over polish, infra, and product extras.

| Decision | Chose (3h) | Deferred / rejected | Why (logistics) |
| --- | --- | --- | --- |
| Backend | Mock data source + factories | Real API / auth | Mocks allowed; network wiring burns an hour without scoring architecture |
| List engine | RN `FlatList` | FlashList | No new native dep; seed + append fits FlatList |
| State | Zustand messages-only + VM `useState` | Redux / everything in the store | Less boilerplate; draft/load out of store avoids list thrash |
| DI | Manual `dependencies.ts` | DI container | YAGNI; one screen; ports still swappable |
| Reco extension | Strategy + card registry | Giant UI `switch` | Open/closed for new types without rewriting bubbles |
| Mocks location | `core/mock-data` | Fixtures in feature `domain/` | Domain stays ports-only; fixtures shared across flows |
| AI actions UI | Custom `MessageActionsModal` | Stock `Alert` / action-sheet lib | Android Alert drops a 4th button; ✕ close without a new package |
| Async UX | Typing row in timeline (~450–500ms) | Overlay spinner / token stream | Chat-native feedback; no LLM in 3h |
| Persistence | In-memory store | AsyncStorage / SQLite | Reload resets; persistence is product work, not architecture proof |
| History | Today-first seed through first AI + append | Multi-day seed + pagination API | Intentional demo; virtualized list is enough |
| Load / empty / error | Data-source flags (`failLoad` / `empty`) | Settings UI toggles | Prove states without an extra screen |
| Navigation | Single conversation screen | Multi-tab app shell | Matches assignment scope |
| Visual system | Inline `StyleSheet` | Design-token theme package | Readable UI; pixel polish is not the rubric focus |
| i18n / deep a11y | English + basic close label | Full i18n suite | Time went to Part A/B flows |
| Automated tests | Ship without Jest smoke in zip | RTL / unit suite | Graders get video + `tsc`; tests compete with feature completeness |
| Demo tooling | Final `demos/*.mp4` only | Keep record/edit scripts in repo | Scripts are not required to run the app; video is the deliverable |

Additional shortcuts:

- Copy uses the clipboard adapter only (no share sheet)
- Platform keyboard / Gboard chrome is OS UI, not app chrome
- Human astrologer joins after consultation (or send keyword), not pre-seeded; post-handoff replies are mock-queued, then AI resumes

**With more time:** persist messages, consider FlashList if history grows, add RTL tests, and swap the mock data source for a real API behind the same ports.
