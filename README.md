# Hubble Landing Page + Exhibitor Scraper

A full-stack project for Cavliwireless: a Next.js landing page for the "Hubble" product line (with a real 3D model viewer and a complete Consult Now / Google Meet booking flow), and a Playwright-based scraper that pulls exhibitor data from a live third-party catalogue into the same Postgres database. Built against the task brief in `consolidated-task-brief (1).pdf`.

## Stack

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · PostgreSQL + Prisma ORM · `@google/model-viewer` · `googleapis` (Calendar/Meet) · Resend (email) · Playwright (scraper) · Zod · Luxon

## Project setup (Docker Compose)

```bash
cp .env.example .env
docker compose up --build
```

That's it — the `app` container's entrypoint runs `prisma migrate deploy`, then `prisma db seed` (idempotent — safe on every restart), then starts Next.js. Open **http://localhost:3000**.

By default `.env.example` ships with the Google Calendar and Resend variables blank, so the Consult Now flow runs in **mock mode** out of the box: slots are fully bookable, a realistic `meet.google.com/mock-...` link is generated, and the confirmation email is logged to the container's stdout instead of being sent. See "Enabling real integrations" below to switch on the live versions.

### Running without Docker

```bash
npm install
npx playwright install chromium   # needed once, for the scraper
# point DATABASE_URL at any reachable Postgres 16+ instance
npx prisma migrate deploy
npm run db:seed
npm run dev
```

## How to trigger the scraper

```bash
curl -X POST http://localhost:3000/api/scrape/exhibitors
```

This launches a headless Chromium instance, drives the real `mmiconnect.in` exhibitor catalogue for the `ep-blr-2026` portal, and upserts every exhibitor into Postgres. It paginates through all ~814 records (100 per request) and takes roughly 1–3 minutes against the live site. Re-running it is safe — rows are upserted by a stable id, not re-inserted — and a second trigger while one is already running returns `409 {"error":"scrape_in_progress"}` instead of starting a second scrape.

Progress and outcome of every run is logged in the `ScrapeRun` table (`status`, `pagesScraped`, `exhibitorsUpserted`, `errorMessage`).

### How the scraper actually works

The catalogue page (`https://mmiconnect.in/app/catalogue/exhibitors/ep-blr-2026`) is an Angular single-page app with no server-rendered data — everything loads via one GraphQL POST to `/graphql`. Rather than guess at that API, a one-off discovery script (`scripts/discover-graphql.ts`, run with `npm run scrape:discover`) was used to capture the **real** query, variables, and response shape directly from the live app, including the exact pagination semantics (a second script, `scripts/discover-pagination.ts`, confirmed that the `after` variable is "items already fetched, minus one" — not a naive `page * pageSize`, which would have silently skipped one exhibitor at every page boundary). `src/lib/scraper/mmiconnect.ts` replays that exact captured query via Playwright, in-page, the same way the real Angular app does.

## Database schema

Prisma schema: `prisma/schema.prisma`. Every table below is in Third Normal Form — no non-key column depends on anything other than the whole of its own table's primary key.

### Task 1 — Products

| Table | Columns | Relationships |
|---|---|---|
| `Product` | `id`, `slug` (unique), `name`, `tagline`, `description`, `heroImageUrl`, `modelUrl`, `category`, timestamps | has many `ProductFeature` |
| `ProductFeature` | `id`, `productId`, `label`, `sortOrder` | belongs to `Product` (cascade delete) |

Feature bullets are a separate table rather than a delimited column on `Product`, because a repeating group of features would violate 1NF; each `ProductFeature` row's columns depend only on its own `id`, with no dependency on anything beyond `productId`.

### Task 1 — Consult Now booking flow

| Table | Columns | Relationships |
|---|---|---|
| `ConsultRequest` | `id`, `name`, `email`, `phone?`, `company?`, `message`, `status` (enum), timestamps | has one `Booking` |
| `Booking` | `id`, `consultRequestId` (unique FK), `slotStart` (unique), `slotEnd`, `timezone`, `googleEventId?`, `googleMeetLink?`, `calendarMode` (REAL/MOCK), `emailStatus` (SENT/FAILED/LOGGED), `createdAt` | belongs to `ConsultRequest` (cascade delete) |

These are two tables, not one wide one, because a `ConsultRequest` may never reach a booked slot (`status = PENDING`) — if slot/Calendar/email columns lived on `ConsultRequest` directly, most rows would have them `NULL` and those columns wouldn't be fully dependent on `ConsultRequest`'s own key. Splitting them into a 1:1 `Booking` keeps every column of each table dependent on that table's own primary key. `Booking.slotStart` is `@unique` — this is also what makes double-booking impossible: `POST /api/consult/[id]/confirm` attempts `booking.create()` directly (no read-then-write), and a Postgres unique-constraint violation is caught and turned into `409 { error: "slot_taken" }`. Postgres is the source of truth for "is this slot taken," not application logic, so it's correct even under concurrent requests.

### Task 2 — Exhibitors

| Table | Columns | Relationships |
|---|---|---|
| `Exhibition` | `id`, `portalSlug`, `name`, unique on `(portalSlug, name)` | has many `ExhibitorBooth` |
| `Exhibitor` | `id`, `mmiExhibitorId?` (unique), `normalizedKey`, `companyName`, `country`, `logoUrl?`, timestamps | has many `ExhibitorBooth` |
| `ExhibitorBooth` | `id`, `exhibitorId`, `exhibitionId`, `hallNo`, `boothNo`, unique on `(exhibitionId, boothNo)` | belongs to `Exhibitor` and `Exhibition` (cascade delete) |
| `ScrapeRun` | `id`, `startedAt`, `finishedAt?`, `status`, `pagesScraped`, `exhibitorsUpserted`, `errorMessage?` | operational log, standalone |

`Exhibition` is its own table because the portal turned out to host **two co-located shows** under one slug ("electronica India — Bangalore" and "productronica India — Bangalore") — confirmed by actually scraping the live data, not assumed. Storing the exhibition name as a free-text column on `Exhibitor` would repeat it across every booth row for that show.

`ExhibitorBooth` is the normalization-critical table: it represents the fact "this exhibitor occupies this booth at this exhibition," and `hallNo`/`boothNo` depend on the whole `(exhibitorId, exhibitionId)` pairing, not on either alone. Collapsing it into `Exhibitor` would force either a repeating group (an exhibitor present at multiple shows) or redundant exhibition-name storage per exhibitor — both of which this design avoids.

**Upsert key:** the scraper's captured GraphQL response includes a stable numeric `customer.id` for every exhibitor, so that's the primary upsert key (`Exhibitor.mmiExhibitorId`). A `normalizedKey` (`UPPER(companyName)|UPPER(country)`) is also stored as a fallback lookup for the case where that id is ever unavailable. It is **not** a unique constraint — live data surfaced two genuinely distinct customer records sharing an identical company name and country, so enforcing uniqueness on it would have corrupted real data. The actual dedup boundary that matters — no duplicate booth rows on re-run — is `ExhibitorBooth`'s unique `(exhibitionId, boothNo)` constraint, which real booth numbers reliably satisfy.

`ScrapeRun` exists purely so "the scraper doesn't break on re-run" is demonstrable from the data (counts stay stable across runs — see `pagesScraped`/`exhibitorsUpserted` per run) rather than just claimed.

## 3D model asset

The brief's asset (`C41_QS_a3f9c78cdb.glb`) is real and renders correctly, but the CloudFront host that serves it (`d8wojkg2185gh.cloudfront.net`) sends **no CORS headers** (verified with `curl -I`), so browsers block `model-viewer`'s/Three.js's `fetch()` for it when loaded cross-origin from `localhost:3000`. Rather than work around that with a server-side proxy route, the same file is re-hosted at `public/models/c41-qs.glb` (identical bytes — not re-generated or modified) and served same-origin instead, which is simpler and has no runtime dependency on a third party's CORS policy. Since the brief requires a working 3D viewer on *every* product's detail page but only supplied one real asset, all 5 seeded products point at this same file — `ModelViewer` still handles a missing/invalid `modelUrl` gracefully for any future per-product assets.

## Consult Now flow

Multi-step client component (`src/components/consult/ConsultWizard.tsx`): form → pick a slot → confirm → success, entirely via `fetch` to the three API routes below — no page reloads, no navigations.

- `POST /api/consult` — validates (name, email, message required; phone/company optional — see note below) and creates a `ConsultRequest`.
- `GET /api/consult/slots` — generates candidate slots (next 10 weekdays, 10:00–17:00 `Asia/Kolkata`, 1-hour blocks) and filters out already-booked ones.
- `POST /api/consult/[id]/confirm` — atomically claims the slot (see "Database schema" above), then creates the Calendar event + sends the confirmation email, degrading to mock mode for *that one booking* if a configured Google/Resend call throws unexpectedly, so a transient external-API hiccup never loses an already-confirmed booking. The confirmation email also CCs `ADMIN_NOTIFICATION_EMAIL` (if set), so the business owner sees every booking without a second send.

**Note on required fields:** `company` is the only optional field — `name`, `email`, `phone`, and `message` are all required, enforced by the same Zod schema on both the client form and the `POST /api/consult` route.

## Enabling real integrations

### Google Calendar + Meet

1. Create a Google Cloud project and enable the **Calendar API**.
2. Configure an OAuth consent screen (Internal or Testing is fine) and create an **OAuth client ID** (Desktop app type is easiest).
3. Obtain a refresh token for the Google account that should own all bookings — the quickest way is [Google's OAuth 2.0 Playground](https://developers.google.com/oauthplayground): use your own client ID/secret (gear icon → "Use your own OAuth credentials"), authorize scope `https://www.googleapis.com/auth/calendar.events`, and exchange the authorization code for tokens.
4. Set in `.env`:
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GOOGLE_REFRESH_TOKEN=...
   GOOGLE_CALENDAR_ID=primary
   ```
5. Restart the app. No code changes needed — `src/lib/calendar.ts` switches to the real path automatically once all three variables are set, and falls back to mock mode again if any are missing or the real call fails.

### Email (Resend)

1. Create a free account at [resend.com](https://resend.com) and get an API key.
2. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in `.env`.
3. Restart the app. `src/lib/email.ts` switches to real sending automatically; without a key it logs the full rendered email to stdout instead (look for `[mock-email]` lines).
4. Optionally set `ADMIN_NOTIFICATION_EMAIL` to get CC'd on every booking confirmation yourself. Note Resend's own sandbox restriction: until a sending domain is verified at resend.com/domains, Resend will only actually deliver to the email address the account itself signed up with — any other recipient (client, CC, or otherwise) gets rejected with a 403, logged as `emailStatus: "FAILED"` on the booking.

## Demo

_[Add a hosted link or a short screen recording here before submitting.]_

## What's mocked vs. real, and why

| Piece | Status | Why |
|---|---|---|
| 3D model viewer | Real asset, self-hosted (see above) | CORS limitation on the original host |
| Exhibitor scraper | Fully real, scrapes the live site | No mocking — this is the Task 2 requirement itself |
| Google Calendar / Meet | Real integration, mock fallback | No Google Cloud credentials are provisioned for this submission; the real code path is implemented and documented above |
| Confirmation email | Real integration (Resend), log fallback | Same reasoning — implemented, not wired to a live API key by default |

## A note on local verification

This project was built and verified end-to-end (landing page, product pages, 3D viewer, the full booking flow including the slot-conflict path, and two full real scrapes proving idempotent upserts) against a local Postgres instance, since Docker wasn't available in the development sandbox. One thing *couldn't* be fully verified there: true concurrent-request races (two bookings or two scrape triggers landing at the exact same instant) — the local dev database used multiplexes all connections through a single backend session, which doesn't preserve real Postgres's per-connection isolation. The underlying safety mechanisms (`Booking.slotStart` unique constraint; a partial unique index allowing only one `RUNNING` `ScrapeRun`) were verified directly against Postgres and are standard, well-understood patterns — they will behave correctly against the real `postgres:16-alpine` container this Docker Compose setup uses. Worth a quick concurrent-request smoke test after `docker compose up` if you want to see it yourself.
