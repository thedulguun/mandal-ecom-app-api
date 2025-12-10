File-Name: PROJECT_SUMMARY.md
File-Role: summary
OS-Version: 0.1.5
Last-Updated: 2025-12-10T17:50:00Z
Last-Updated-By: AI
Special-OS-File: false

Note: This summary can be stale. Say "update summaries" in an AI chat to refresh it before relying on it.

# Project Snapshot
- Internal tool: Node + Express API proxy in `API/` forwarding to ebuuhia.mn; published npm SDK `mandal-ebuuhia-sdk` wraps the same endpoints.
- Local static snapshot (`downloaded-next-static/`) is rewritten to call the proxy; `api-test.html` remains the raw test harness. Both can log requests to `api-call-log.json`.
- Added API guide design with “when to use” guidance per endpoint to help consumers pick the right call.
- Users: requester and internal team; keep simple, high-autonomy development.

# Current Scope
- Proxy and SDK cover the captured delivery/report/item endpoints (login, deliveries, ware/item lookups, charts/totals, etc.); token kept in memory on the server.
- npm package ships dist builds (CJS/ESM) with convenience helpers for config/login; proxy exposes matching routes under `/api`.
- Static snapshot and test page exercise the API; request logger helps surface missing endpoints for future additions.

# Constraints & Preferences
- Stack: Node + Express backend; vanilla JS frontend; Node 18+ for built-in `fetch`.
- Config via environment (e.g., `EBUUHIA_BASE_URL`); secrets handling lightweight; tokens stored in-memory during runtime.
- Minimal dependencies and fast iterations; avoid over-engineering.

# Risks & Unknowns
- Provider API contract and token expiry/refresh behavior still uncertain; may need adjustments.
- Live access may be limited; captured requests may be the main reference.
- Security hardening and tests are minimal; may need strengthening if scope grows.

# How to Work With It
- Keep captured requests up to date; map new endpoints into the proxy and client SDK.
- Extend the client SDK first, then wire the proxy and UI; keep changes small and test with the static page.
- Add env keys as new provider requirements emerge (base URL, credentials, headers).
- Use generation scripts (`generate-client`, `generate-inferred`) and proxy/test page to validate flows; note multipart uploads still need special handling.
