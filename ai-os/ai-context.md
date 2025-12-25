File-Name: ai-context.md
File-Role: context
OS-Version: 0.1.7
Last-Updated: 2025-12-25T15:32:30Z
Last-Updated-By: AI
Special-OS-File: false

# Project Context

## Project Overview
- Internal e-commerce operations helper that integrates with delivery provider ebuuhia.mn via their API.
- Ship a Node + Express proxy in `API/` plus an npm package `mandal-ebuuhia-sdk` that wraps the captured/inferred HTTP calls.
- Provide a local static snapshot (`downloaded-next-static/`) and a test HTML harness to exercise flows; snapshot is rewritten to call the local proxy and can log API calls.

## Goals & Scope
- Short term: keep the proxy and SDK aligned with captured requests, including login and the growing set of delivery/report/item endpoints.
- Medium term: expand coverage to the remaining captured-but-untested endpoints and harden the SDK convenience helpers.
- Keep the endpoint contract and validation report generated from runtime captures; document flows only when observed.
- Keep the system simple and maintainable for a small internal team; prefer clear wiring (proxy base, SDK config) and simple docs.
- Keep a repeatable “website → proxy → SDK” playbook in docs for future integrations.

## Users & Stakeholders
- Primary users: the requester and their internal team.
- Audience is technical but prefers simplicity; AI has high autonomy to build/prioritize.

## Constraints & Preferences
- Stack: Node + Express for API; vanilla JS for static page.
- Environment config: `.env` stored at `API/.env`; secrets handling kept light for now.
- Tokens: keep in-memory during runtime; provide a clear-token/logout action.
- Delivery list: fetch-all initially; no filters yet.
- Operations should move fast but avoid breakage; prefer minimal dependencies.
- Prefer evidence-based docs and validation (avoid assumptions when contract is unknown).

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
