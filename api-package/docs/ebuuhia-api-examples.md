# ebuuhia.mn API Request Examples (captured)

Purpose: store real requests/responses so we can mirror behavior in the proxy and SDK. For the full production-ready endpoint list, see `docs/api-reference.md`.

## How to Capture (browser)
- Open browser DevTools -> Network (XHR/fetch filter).
- Perform the action (login, list deliveries, reports, etc.).
- Right-click the request -> Copy as cURL; paste a sanitized version below and/or in `docs/captured-requests/`.
- Redact PII; keep tokens only as placeholders. Note timestamps or query params that matter.

## Quick samples

### Login / token retrieval
- Method/Path: `POST /login` (base: `${EBUUHIA_BASE_URL || https://api.ebuuhia.mn/api/v1}`)
- Auth: none on request; response body contains `token` (and `data.token` in some cases).
- Headers: `Content-Type: application/json`, `Accept: application/json, text/plain, */*`
- Body (JSON):
```json
{
  "email": "<user email>",
  "password": "<password>",
  "device_token": null
}
```
- Example cURL:
```bash
curl -X POST "${EBUUHIA_BASE_URL}/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/plain, */*" \
  --data-raw '{"email":"<user>","password":"<pass>","device_token":null}'
```
- Response: `{ "user": { ... }, "token": "<jwt>", "tokenExpTime": "<timestamp>" }`

### Delivery list (customer view)
- Method/Path: `GET /getDeliveryCustomer`
- Auth: `Authorization: <token>` (raw token, no `Bearer`).
- Common query params: `startLimit`, `endLimit`, `order`, `sort`, `search`, `value`, `status`, `id`, `action`, `type`.
- Example cURL:
```bash
curl "${EBUUHIA_BASE_URL}/getDeliveryCustomer?startLimit=0&endLimit=100&order=&sort=asc&search=&value=&status=100&id=<userId>&action=0" \
  -H "Authorization: <token>" \
  -H "Accept: application/json, text/plain, */*"
```
- Response: `{ "data": { "result": [...], "resultItem": [...] }, "pagination": <number>, "token": "<token>" }`

### Reports and inventory captures
- We have captured samples for financial and merged customer reports, warehouse inventory, and past/new delivery lists. See the files under `docs/captured-requests/` for raw cURL plus responses.

## Captured files on disk
- `docs/captured-requests/login.md` — login request/response.
- `docs/captured-requests/logout.md` — the two GETs used when logging out.
- `docs/captured-requests/getNewDeliveryList.md` and `getPastDeliveryList.md` — delivery list variations.
- `docs/captured-requests/getFinancialReport.md` — general customer report by user.
- `docs/captured-requests/getMergedCustomerReport.md` — merged customer report.
- `docs/captured-requests/getProductInventory.md`, `getWarehouseInventoryReport.md`, `wareById.md` — inventory lookups.
- `docs/captured-requests/getNewCustomerReport.md`, `userById.md` — user/report lookups.
- `api-call-log.json` — rolling log from the rewritten static snapshot; useful for spotting missing endpoints.

## Template (copy for new captures)
```
### <Action name>
- Method/Path: <METHOD> <PATH> (base: ${EBUUHIA_BASE_URL})
- Auth: <Authorization header | none> (source: login response)
- Required headers:
  - Header-Name: value
- Request body (JSON):
```json
{
  "field": "value"
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
- Notes: pagination, required query params, quirks (cookies, CSRF, etc.).
```
