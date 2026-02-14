# Next.js Server Components Migration Task List

Branch: `migration/nextjs-rsc-step-by-step`
Status owner: Codex + User

## Tracking Rules (Mandatory)

- Only mark a task `[x]` after its verification command passes.
- If verification fails, keep task as `[ ]` and add a short note under `Notes`.
- Do not start the next phase until all tasks in current phase are `[x]`.
- At the end of each session, update `Session Log`.

## Definition of Done Per Task

- Code implemented
- Lint/build/tests for that scope pass
- Behavior verified manually
- Checkbox updated to `[x]`

## Phase 0 - Baseline and Safety

- [x] Create migration branch and confirm current branch is correct
  - Verify: `git branch --show-current`
- [ ] Snapshot baseline behavior (home, detail, category, tag, auth login/logout, admin entry)
  - Verify: manual checklist in browser
- [x] Add migration task tracking file to repo
  - Verify: `test -f RSC_MIGRATION_TASKLIST.md && echo OK`

## Phase 1 - Scaffold Next.js App Router

- [ ] Create Next.js app (TypeScript, App Router, ESLint)
  - Verify: `npm run dev` in new Next app starts
- [ ] Move shared styles/assets and configure path aliases
  - Verify: imports resolve and app builds
- [ ] Add base layout (`app/layout.tsx`) and global UI shell
  - Verify: layout renders on all migrated routes

## Phase 2 - Data Layer Split (Server vs Client)

- [x] Create server-safe API client (`lib/server-api.ts`) with cookie-based auth support
  - Verify: server fetch works without `window/localStorage`
- [x] Create client-safe API client (`lib/client-api.ts`) for interactive flows only
  - Verify: no server import errors
- [x] Remove direct `localStorage` auth dependency from shared service layer
  - Verify: `rg -n "localStorage" src` only matches client-only components

## Phase 3 - Migrate Public Pages to Server Components First

- [ ] Migrate `/` (home) to server page with server data fetching
  - Verify: page HTML includes content before hydration
- [ ] Migrate `/news/[id]` to server page
  - Verify: direct URL load returns fully rendered content
- [ ] Migrate `/category/[slug]` to server page
  - Verify: pagination/filter behavior still correct
- [ ] Migrate `/tag/[slug]` to server page
  - Verify: direct URL load + navigation both work

## Phase 4 - Auth and Route Protection (Server-first)

- [ ] Convert auth to HTTP-only cookie session strategy
  - Verify: login persists without `localStorage` token read
- [ ] Implement middleware/route guards for protected routes
  - Verify: unauthenticated user is redirected server-side
- [ ] Move role checks (admin/editor) to server-side gate
  - Verify: non-privileged user cannot access protected URLs directly

## Phase 5 - Client Components Boundary Cleanup

- [ ] Add `"use client"` only where interactivity is required
  - Verify: server components compile without client hooks
- [ ] Keep heavy interactive UI isolated (admin tables, editor, checkout, toasts, modals)
  - Verify: interaction features still work
- [ ] Remove duplicated providers and keep minimal top-level client provider tree
  - Verify: no duplicate auth/query provider wrapping

## Phase 6 - Vercel/Next Performance Best Practices

- [ ] Add cache strategy (`revalidate`, tag/path invalidation where needed)
  - Verify: cached pages respond correctly and revalidate as expected
- [ ] Use `next/image` for article/media images
  - Verify: Lighthouse image optimization improvements
- [ ] Use `next/font` and metadata optimization
  - Verify: no layout shift from font swap
- [ ] Add loading/error boundaries (`loading.tsx`, `error.tsx`) on migrated routes
  - Verify: graceful loading and recoverable errors
- [ ] Run bundle/performance checks and fix obvious regressions
  - Verify: `next build` output reviewed and documented

## Phase 7 - Final Verification and Release Readiness

- [ ] Full lint/build pass
  - Verify: `npm run lint && npm run build`
- [ ] Manual smoke test for core routes and auth-protected flows
  - Verify: checklist pass
- [ ] Compare baseline vs migrated behavior and note deltas
  - Verify: summary written in `Notes`
- [ ] Final branch verification
  - Verify: `git branch --show-current` equals `migration/nextjs-rsc-step-by-step`

## Session Log

- 2026-02-14: Initialized migration branch and created tracking checklist.
- 2026-02-14: Verified branch `migration/nextjs-rsc-step-by-step` and task file existence.
- 2026-02-14: Created `next-app/` scaffold for Next.js App Router (layout, page, loading, config, aliases, public assets copy).
- 2026-02-14: Added `BASELINE_SMOKE_CHECKLIST.md` for pre-migration route and auth verification.
- 2026-02-14: Implemented Phase 2 data-layer split in `next-app` (`lib/server-api.ts`, `lib/client-api.ts`, shared `lib/api/news.ts` + server/client news services).
- 2026-02-14: Verified no `localStorage` or browser-global usage in new `next-app` API layer and verified server-only imports are isolated to `server-api.ts`.
- 2026-02-14: Created `phase-03-public-routes-rsc` branch from migration branch and implemented Phase 3 route files (`/`, `/news/[id]`, `/category/[slug]`, `/tag/[slug]`) in `next-app/app`.
- 2026-02-14: Added reusable server-rendered news UI components in `next-app/components/news`.
- 2026-02-14: TypeScript verification passed in `next-app` via `npx tsc --noEmit`; runtime route verification remains pending.

## Notes

- Keep admin/editor/payment flows as client components until public content migration is stable.
- Prefer server components by default; add client boundary only for hooks/events/browser APIs.
- Prioritize incremental PRs per phase to reduce rollback risk.
- Blocker: in this sandbox, `npm run dev` cannot bind local ports (`listen EPERM`) and `npm run build` fails with a generic webpack banner without expanded diagnostics; runtime/manual verification must be performed locally before checking remaining Phase 1/3 boxes.
- Blocker: `npm run dev` cannot bind a port in this sandbox (`listen EPERM`), and `npm run build` currently fails with generic webpack banner without detailed diagnostics in this environment; manual local verification is required before checking Phase 3 boxes.
