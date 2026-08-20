# Railway Postgres listings — implementation plan

> **For agentic workers:** implement task-by-task. Steps use checkbox syntax.

**Goal:** Persist listings in Railway Postgres and photos on the Volume so production is worldwide.

**Architecture:** Drizzle + `pg` when `DATABASE_URL` is set; JSON fallback for local. Uploads via Volume + `/api/uploads/:name`.

**Tech Stack:** Postgres, Drizzle ORM, Railway Volume, existing admin APIs.

## Tasks

- [x] Schema + `getDb` / `ensureListingsTable`
- [x] Rewrite `listings-store` for Postgres + JSON fallback
- [x] Upload to Volume + public serve route
- [ ] Commit and push to `origin/main` for Railway auto-deploy
- [ ] Verify production `/api/listings` and `/admin`
