File-Name: client-sdk-design.md
File-Role: notes
OS-Version: 0.1.3
Last-Updated: 2025-12-09T05:10:00Z
Last-Updated-By: AI
Special-OS-File: false

# Client SDK + Proxy + Test Page (current design)

## Goal
- Single generated client library so UIs (like `api-test.html`) call helpers instead of hand-written `fetch` calls.
- Keep things simple for a beginner: explain tech names with quick brackets (e.g., proxy [middle server that forwards requests]).

## Structure (today)
- `client/`
  - `shared/config.js` - base URL + token helpers; default headers.
  - `shared/http.js` - thin `fetch` [built-in HTTP requester] wrapper with JSON parsing and normalized errors.
  - `generated/`
    - `from-captures.js` - auto-built from `docs/captured-requests/*` via `node scripts/generate-client.js`.
    - `inferred.js` - auto-built from `scripts/inferred-endpoints.json` via `node scripts/generate-inferred.js`.
  - `helpers.js` - single barrel export of config + all generated helpers (no hand-written helpers remain).
  - `browser/index.js` and `node/index.js` - re-export `helpers.js` for browser/Node use.
- `API/index.js` - Express proxy [server that relays] at `http://localhost:3000/api` -> `https://api.ebuuhia.mn/api/v1`; strips bodies on GET/HEAD to avoid 500s; keeps `Authorization` as the raw token; sets `accept-language: mn`.
- `api-test.html` - browser UI that defaults to the proxy; buttons/dropdowns for most endpoints plus a manual caller.

## API surface (generated)
- Helpers cover captured endpoints and inferred ones (orders, delivery, users/branches/roles/region/khoroo, delete helpers, web help, print/report, notifications).
- Shared utilities: `setBaseUrl`, `getBaseUrl`, `setToken`, `getToken`.
- Helpers return `{ status, data, headers }` or throw `{ message, status, body }` on errors.
- Auth header uses the raw token (no `Bearer` prefix) per captures; flip if the live API requires `Bearer`.

## How to generate
- From captures -> helpers: `node scripts/generate-client.js` (reads `docs/captured-requests/`, writes `client/generated/from-captures.js`).
- From inferred list -> helpers: edit `scripts/inferred-endpoints.json` if needed, then `node scripts/generate-inferred.js` (writes `client/generated/inferred.js`).

## How to run and test
- Proxy: `cd API && npm install && npm start` (Node 18+). Base: `http://localhost:3000/api`.
- Test page: open `api-test.html`, set Base URL (defaults to proxy), login to get a token, then use buttons/dropdowns or the manual caller. Simple list calls work; add params (page, pageSize, search) via manual caller if you need earlier pages.
- For uploads/multipart (e.g., Excel/image): not yet wired; use manual caller with `FormData` in devtools or extend proxy/helpers to pass FormData without forcing JSON.

## Known gaps / next tweaks
- Validate inferred endpoints against live API and adjust `scripts/inferred-endpoints.json` if methods/paths differ, then regenerate.
- Add multipart handling for upload endpoints.
- Pre-fill common query params in the test page to avoid mid-list paging surprises.
