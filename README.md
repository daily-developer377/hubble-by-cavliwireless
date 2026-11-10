# Hubble Landing Page

A full-stack project for Cavliwireless: a Next.js landing page for the "Hubble" product line (with a real 3D model viewer and a complete Consult Now / Google Meet booking flow), and a Playwright-based scraper that pulls exhibitor data from a live third-party catalogue into the same Postgres database.

## Stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · PostgreSQL + Prisma ORM · `@google/model-viewer` · `googleapis` (Calendar/Meet) · Resend (email) · Playwright (scraper) · Zod · Luxon

## Setup (Docker Compose)

```bash
cp .env.example .env
docker compose up --build
```

The `app` container runs migrations and seeds the database automatically, then starts Next.js. Open **http://localhost:3000**.

By default the Calendar and Resend variables are blank, so the Consult Now flow runs in **mock mode**: slots are bookable, a `meet.google.com/mock-...` link is generated, and the confirmation email is logged to stdout instead of sent. See "Enabling real integrations" below to turn on the live versions.

### Without Docker

```bash
npm install
npx playwright install chromium   # needed once, for the scraper
# point DATABASE_URL at any reachable Postgres 16+ instance
npx prisma migrate deploy
npm run db:seed
npm run dev
```

## Triggering the scraper

```bash
curl -X POST http://localhost:3000/api/scrape/exhibitors
```

Drives a headless Chromium instance against the live `mmiconnect.in` exhibitor catalogue (`ep-blr-2026` portal) and upserts every exhibitor into Postgres (~814 records, 1–3 minutes). Safe to re-run — rows are upserted by a stable id — and a second trigger while one is running returns `409 {"error":"scrape_in_progress"}`.

Each run's progress/outcome is logged in the `ScrapeRun` table.

## Database schema

Prisma schema: `prisma/schema.prisma`.

| Table | Purpose |
|---|---|
| `Product`, `ProductFeature` | Product catalogue and feature bullets |
| `ConsultRequest`, `Booking` | Consult Now submissions and their confirmed slot/Calendar/email outcome |
| `Exhibition`, `Exhibitor`, `ExhibitorBooth` | Scraped exhibitor data and booth assignments |
| `ScrapeRun` | Operational log of each scrape |

## Consult Now flow

Multi-step client flow (`src/components/consult/ConsultWizard.tsx`): form → pick a slot → confirm → success.

- `POST /api/consult` — validates and creates a `ConsultRequest` (`name`, `email`, `phone`, `message` required; `company` optional).
- `GET /api/consult/slots` — next 10 weekdays, 10:00–17:00 `Asia/Kolkata`, 1-hour blocks, minus already-booked slots.
- `POST /api/consult/[id]/confirm` — atomically claims the slot, creates the Calendar event, and sends the confirmation email (CCs `ADMIN_NOTIFICATION_EMAIL` if set).

## Enabling real integrations

### Google Calendar + Meet

1. Create a Google Cloud project and enable the **Calendar API**.
2. Create an **OAuth client ID** (Desktop app type is easiest).
3. Get a refresh token via [Google's OAuth 2.0 Playground](https://developers.google.com/oauthplayground) with scope `https://www.googleapis.com/auth/calendar.events`.

   > **Note:** if the OAuth consent screen is left in **Testing** mode, refresh tokens expire after 7 days. Publish the app (OAuth consent screen → Publish App) to avoid having to redo this step weekly — for this use case that doesn't require Google's verification review, it just shows an "unverified app" warning during consent.
4. Set in `.env`:
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REFRESH_TOKEN=...
   GOOGLE_CALENDAR_ID=primary
   ```
5. Restart the app — it switches to the real path automatically once all three variables are set.

### Email (Resend)

1. Create a free account at [resend.com](https://resend.com) and get an API key.
2. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in `.env`.
3. Optionally set `ADMIN_NOTIFICATION_EMAIL` to get CC'd on every booking.

Without a key, emails are logged to stdout (`[mock-email]`) instead of sent.

## What's mocked vs. real

| Piece | Status |
|---|---|
| 3D model viewer | Real asset, self-hosted (original CDN host has no CORS headers) |
| Exhibitor scraper | Fully real, scrapes the live site |
| Google Calendar / Meet | Real integration, mock fallback (no credentials provisioned for this submission) |
| Confirmation email | Real integration (Resend), log fallback by default |
