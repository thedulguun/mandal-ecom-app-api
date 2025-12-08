File-Name: ai-context.md
File-Role: context
OS-Version: 0.1.3
Last-Updated: 2025-12-09T02:55:00Z
Last-Updated-By: AI
Special-OS-File: false

# Project Context

## Project Overview
- Internal e-commerce operations helper that integrates with delivery provider ebuuhia.mn via their API.
- Build a simple Node + Express API in `API/` to handle login (token retrieval) and delivery list retrieval, exposing endpoints our app will consume.
- Provide a root static HTML page to simulate the app workflow: login, logout/clear token, fetch delivery list.

## Goals & Scope
- Short term: replicate browser interactions with ebuuhia.mn using captured requests to implement login and fetch deliveries; keep implementation minimal and clear.
- Medium term: expand to more delivery operations (creation, updates, inventory) as endpoints are discovered.
- Keep the system simple and maintainable for a small internal team.

## Users & Stakeholders
- Primary users: the requester and their internal team.
- Audience is technical but prefers simplicity; AI has high autonomy to build/prioritize.

## Constraints & Preferences
- Stack: Node + Express for API; vanilla JS for static page.
- Environment config: `.env` stored at `API/.env`; secrets handling kept light for now.
- Tokens: keep in-memory during runtime; provide a clear-token/logout action.
- Delivery list: fetch-all initially; no filters yet.
- Operations should move fast but avoid breakage; prefer minimal dependencies.

## Non-Goals
- No external deployment setup defined yet.
- No advanced auth UX or hardened secret management beyond `.env` at this stage.
- No comprehensive automated test suite requested yet; manual via static page is acceptable initially.

## Assumptions
- Exact endpoints, payloads, and headers will be inferred from captured browser requests.
- Token lifetime/refresh behavior is unknown; start with simple login-per-session and manual clear.
- Network access may be limited; captured requests may substitute for live calls until credentials are available.

## Open Questions
- Precise API contract (fields, validation) and token expiry/refresh requirements.
- Whether future features require persistence beyond in-memory token handling.
