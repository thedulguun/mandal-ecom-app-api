File-Name: ai-roadmap.md
File-Role: roadmap
OS-Version: 0.1.0
Last-Updated: 2025-12-08T09:22:00Z
Last-Updated-By: AI
Special-OS-File: false

# Roadmap

## Near-Term
- Stand up Node + Express scaffold in `API/` with env-driven config for ebuuhia base URL and credentials.
- Implement login endpoint using captured browser requests; store token in-memory with clear/logout path.
- Implement delivery list fetch endpoint to validate login flow; wire to static HTML page actions (login, logout/clear token, fetch deliveries).
- Add basic logging and error surfacing; document required `.env` keys as discovered.

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
