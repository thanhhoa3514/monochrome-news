# Monochrome News Flash - Next.js Frontend

This repository contains the Next.js 14 frontend for Monochrome News Flash. It powers the public reader experience, authentication flow, admin and editor dashboards, subscription checkout, and reader-engagement features such as follows, notification center, and digest settings.

## Features

- Public news homepage, category pages, tag pages, and article detail pages
- Login, registration, logout, and role-based dashboard redirects
- Admin and editor dashboards for content and user management
- Subscription checkout with Stripe and provider-aware pricing flow
- Reader engagement features:
  - follow categories and tags
  - in-app notification center
  - digest preferences and digest preview
- Next.js proxy/API route layer for forwarding authenticated requests to the Laravel backend

## Tech Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Radix UI / shadcn-style components

## Prerequisites

- Node.js 18 or newer
- npm
- A running backend instance from `backend-php-news-app`

## Environment Variables

Create a `.env.local` file with at least:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain
NEXT_PUBLIC_SITE_URL=https://your-frontend-domain
NEXT_PUBLIC_SEPAY_ENABLED=false
```

Optional variables used in some flows:

```env
DEMO_API_URL=https://your-backend-domain
AUTH_COOKIE_NAME=auth_token
```

## Development Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

## Build and Verification

Run the production build:

```bash
npm run build
```

Useful scripts:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Architecture Notes

- Public routes live under the `(public)` route group.
- Admin and editor dashboards live under the `(dashboard)` route group.
- Browser-side authenticated requests go through `app/api/proxy/[...path]/route.ts`.
- Authentication uses a frontend-owned `httpOnly` cookie, while the backend remains the source of truth for user and entitlement data.

## Key User Flows

- Public reading:
  - browse homepage, categories, tags, and articles
- Authentication:
  - login/register
  - role-based redirect to `/admin` or `/editor`
- Subscriptions:
  - choose a plan on `/pricing`
  - redirect to Stripe checkout or provider-aware flow
  - receive premium access after successful activation
- Reader engagement:
  - follow categories and tags
  - receive notification-center updates
  - manage digest preferences in `/settings`

## Related Repository

Backend API:

- `../backend-php-news-app`

