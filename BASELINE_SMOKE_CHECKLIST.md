# Baseline Smoke Checklist (Pre-Migration)

Date: 2026-02-14
Environment: Existing Vite SPA (`src/App.tsx`)
Goal: Capture baseline behavior before route-by-route Next.js migration.

## Public Routes

- [ ] `/` home loads and shows featured/latest/trending sections
- [ ] `/news/:id` detail page loads article content
- [ ] `/category/:slug` category page loads and paginates
- [ ] `/tag/:slug` tag page loads and paginates
- [ ] `/search?q=...` search returns relevant results
- [ ] `/landing` marketing/landing renders correctly

## Auth Flows

- [ ] `/login` login with valid credentials works
- [ ] Logout works and redirects/clears auth state
- [ ] `/register` OTP registration flow works
- [ ] `/user/profile` is blocked when unauthenticated

## Protected/Admin/Editor

- [ ] `/admin/login` loads and authenticates admin
- [ ] `/admin` rejects non-admin user
- [ ] `/editor` rejects non-editor/non-admin user

## Payment/Subscription

- [ ] `/pricing` displays plans
- [ ] `/checkout/:planId` loads plan and checkout action
- [ ] `/payment-success` callback handling works

## UI/UX Sanity

- [ ] Header/nav renders across core routes
- [ ] Footer renders across core routes
- [ ] No critical console errors in browser for core flows

## Notes

- Use this file as baseline evidence before migrating each route.
- After every migrated route, compare behavior against its baseline counterpart.
