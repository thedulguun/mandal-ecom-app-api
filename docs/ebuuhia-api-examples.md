# ebuuhia.mn API Request Examples

Purpose: keep a single place to record real requests/responses captured from the ebuuhia.mn web app so we can mirror them in our Node API and static page.

## How to Capture (browser)
- Open browser DevTools → Network; filter XHR/fetch.
- Perform the action in the site (login, list deliveries, etc.).
- Right-click the request → Copy as cURL; paste into this doc under the matching section.
- Note the timestamp and any dynamic values (tokens, cookies) so we can adapt env vars or runtime handling.

## Conventions
- Base URL: store as `EBUUHIA_BASE_URL` in `API/.env` (e.g., `https://example.ebuuhia.mn`).
- Tokens: capture where they appear (response body vs. header); note expiry if visible.
- Keep headers as close to captured form as possible; mark any PII you redact.

## Template (copy for new endpoints)
```
### <Action name>
- Method/Path: <METHOD> <PATH> (base: ${EBUUHIA_BASE_URL})
- Auth: <Bearer token | Cookie | None> (source: <where it comes from>)
- Required headers:
  - Header-Name: value-or-TODO
- Request body (JSON):
```json
{
  "field": "value-or-TODO"
}
```
- Example cURL:
```bash
curl -X <METHOD> "${EBUUHIA_BASE_URL}<PATH>" \
  -H "Header-Name: value" \
  -d '{"field":"value"}'
```
- Typical 200 response:
```json
{
  "field": "value"
}
```
- Notes: edge cases, pagination, required query params, CSRF tokens, etc.
```

## Login / Token Retrieval
- Goal: obtain the session token required for subsequent calls.
- Method/Path: POST `<TBD login path>` (base: ${EBUUHIA_BASE_URL})
- Auth: none for request; response returns token `<TBD token field>` or sets cookie `<TBD cookie name>`.
- Required headers: Content-Type (likely `application/json`); any anti-CSRF headers (TBD).
- Request body (JSON, captured):
```json
{
  "username": "<your user>",
  "password": "<your password>"
}
```
- Example cURL (replace placeholders after capture):
```bash
curl -X POST "${EBUUHIA_BASE_URL}<TBD login path>" \
  -H "Content-Type: application/json" \
  --data-raw '{"username":"<user>","password":"<pass>"}'
```
- Expected success indicator: `<TBD>` (token field, cookie, or redirect).
- Notes: record token lifetime if visible; note if cookies + XSRF tokens are required.

## Delivery List (fetch all)
- Goal: retrieve list of deliveries after login.
- Method/Path: GET `<TBD deliveries path>` (base: ${EBUUHIA_BASE_URL})
- Auth: likely Bearer `${TOKEN}` or session cookie from login (TBD).
- Required headers: Authorization (TBD format), Accept (e.g., `application/json`), others (TBD).
- Query params: pagination/filter params if present (TBD).
- Example cURL (fill once captured):
```bash
curl -X GET "${EBUUHIA_BASE_URL}<TBD deliveries path>" \
  -H "Authorization: Bearer <token or cookie here>" \
  -H "Accept: application/json"
```
- Typical 200 response (structure TBD):
```json
{
  "deliveries": [
    {
      "id": "<uuid-or-number>",
      "status": "<status>",
      "customer": "<name>",
      "address": "<string>",
      "createdAt": "<timestamp>"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "total": "<count>"
  }
}
```
- Notes: capture any required cookies; note if there is a CSRF token or referrer check.

## Future Endpoints to Capture
- Delivery create/update.
- Inventory operations.
- Status updates / tracking.
- Any supporting metadata endpoints (lookups, configs).
