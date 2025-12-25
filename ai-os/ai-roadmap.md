File-Name: ai-roadmap.md
File-Role: roadmap
OS-Version: 0.1.7
Last-Updated: 2025-12-25T15:32:30Z
Last-Updated-By: AI
Special-OS-File: false

# Roadmap

## Near-Term
- Keep the proxy (`API/`) aligned with captured endpoints; add any missing routes as new calls are observed in `api-call-log.json`.
- Maintain the published SDK (`mandal-ebuuhia-sdk`) so it mirrors proxy behavior and captured request shapes.
- Use the rewritten local snapshot and test harness to validate flows; capture new HAR/logs for uncovered endpoints.
- Document env keys and minimal setup so the proxy and snapshot wiring stay reproducible.
- Keep the endpoint contract and validation report generators in sync with captures.
- Maintain the playbook for repeating this process on other sites/providers.

## Mid-Term
- Expand API coverage: create/update deliveries, inventory management, status updates as endpoints become known.
- Add token refresh/expiry handling once behavior is understood; consider lightweight caching strategy.
- Introduce optional lightweight tests or mocked flows to guard key endpoints.
- Improve static page UX to simulate more workflows and edge cases.

## Risks & Unknowns
- API contract uncertainty (endpoints, headers, token lifetime) may cause rework.
- Network/credential availability could block live validation; may rely on recorded requests.
- Security/secret handling is minimal by choice; may need tightening if scope or audience grows.
- Long-term maintenance risk if schema or provider API changes frequently; mitigate with captured examples and adaptable code paths.
