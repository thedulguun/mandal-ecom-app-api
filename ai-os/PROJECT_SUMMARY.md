File-Name: PROJECT_SUMMARY.md
File-Role: summary
OS-Version: 0.1.0
Last-Updated: 2025-12-08T09:22:00Z
Last-Updated-By: AI
Special-OS-File: false

Note: This summary can be stale. Say "update summaries" in an AI chat to refresh it before relying on it.

# Project Snapshot
- Internal tool: Node + Express API in `API/` integrating with ebuuhia.mn to log in, obtain tokens, and fetch delivery lists; paired with a root static HTML page to simulate app workflow.
- Users: the requester and internal team; long-term, simple, high-autonomy development.

# Current Scope
- Implement login (token retrieval) and delivery list fetch using captured browser requests.
- Static page actions: login, logout/clear token, fetch all deliveries.
- Token stored in-memory during runtime; logout clears it.

# Constraints & Preferences
- Keep implementation simple; vanilla JS for static page.
- Config in `API/.env`; secrets handling is lightweight.
- Move fast but avoid breakage; minimal dependencies.

# Risks & Unknowns
- Exact API endpoints, headers, payloads, and token expiry/refresh behavior are unknown until captured.
- Live network/credential access may be limited; may rely on recorded requests.
- Secret management and testing are minimal initially and may need tightening later.

# How to Work With It
- Capture real requests/responses from the provider to drive implementation details.
- Add env keys as endpoints reveal requirements (base URL, creds, headers).
- Extend API and static page incrementally as more operations are understood; keep changes small and verified manually.
