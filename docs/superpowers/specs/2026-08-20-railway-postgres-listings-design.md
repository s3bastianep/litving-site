# Railway Postgres + Volume for Litving listings

## Goal
Persist property listings in Railway Postgres and uploaded photos on a Railway Volume so the public site (`litving-site-production-6033.up.railway.app`) shows the same catalog worldwide.

## Architecture
- **Postgres** (`DATABASE_URL`): table `listings` stores all managed listing fields (JSON arrays for gallery/amenities).
- **Volume** mounted at `/app/data/uploads`: admin photo uploads; served via `/api/uploads/:filename`.
- **Admin** and public catalog APIs keep the same routes; only the storage layer changes.
- **Local fallback**: if `DATABASE_URL` is missing, keep the existing JSON file store for `vinext dev`.

## Data model
One row per listing; fields match `ManagedListing` in `app/lib/listings-store.ts`. Arrays stored as `jsonb`.

## Ops (Railway — done by user)
- Postgres service + `DATABASE_URL` reference on `litving-site`
- `ADMIN_USER`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`
- Volume on `litving-site` at `/app/data/uploads`

## Out of scope
Custom domain, CDN for images, multi-user auth.
