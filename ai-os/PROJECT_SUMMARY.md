File-Name: PROJECT_SUMMARY.md
File-Role: summary
OS-Version: 0.1.3
Last-Updated: 2025-12-09T02:55:00Z
Last-Updated-By: AI
Special-OS-File: false

Note: This summary can be stale. Say "update summaries" in an AI chat to refresh it before relying on it.

# Project Snapshot
- Internal tool: Node + Express API proxy in `API/` forwarding to ebuuhia.mn; client SDK in `client/`; static HTML test page consumes the SDK.
- Users: requester and internal team; keep simple, high-autonomy development.

# Current Scope
- Implement login (token retrieval) and delivery list fetch based on captured browser requests.
- Proxy endpoints: `/api/login`, `/api/deliveries`, `/api/logout`; token kept in memory on the server.
- Static page (`api-test.html`) uses the browser client module by default against the local proxy; can point directly at the provider if needed.
- Expanded helpers: generated from captures plus inferred endpoint list; proxy passthrough routes; test page has buttons/dropdowns for most endpoints and a manual caller.

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
