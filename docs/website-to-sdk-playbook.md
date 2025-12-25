# Website-to-SDK Playbook

Purpose: repeatable steps to turn a website into an SDK [client helper library] + proxy [server that forwards requests] using captured traffic (so we don’t guess the API contract).

## Glossary (simple)
- Website: the UI you click through (browser).
- Upstream: the real provider server the website talks to.
- Proxy [middle server that forwards requests]: our local server that the website and our apps call; it forwards to upstream.
- SDK [helper library]: a reusable code package that calls the proxy (or upstream) with nice functions.
- Capture: a recorded request + response (what the website actually did).
- Contract [observed fields map]: a machine-readable summary of captured methods and fields, generated from captures.
- “Required” (in contract): “present in every capture for that endpoint+method and non-empty” (not necessarily required by upstream).

## Inputs
- A working website (live or static snapshot).
- Local proxy [middle server that forwards requests] in `API/`.
- Runtime capture directory: `docs/captured-requests/runtime/`.

## Outputs (what you should end up with)
- Captures: `docs/captured-requests/runtime/*.json`
- Contract: `docs/endpoint-contract.json`
- Contract summary: `docs/endpoint-contract-summary.md`
- Validation report [proxy-enforced fields]: `docs/validation-report.md`
- Proxy routes: `API/index.js`
- SDK build output: `api-package/dist/`
- Human docs: `docs/api-reference.md`

## Pre-flight checklist (do this first)
1) Decide scope
   - List the UI features you actually need to support (don’t try to cover “everything”).
   - Translate that into “tasks” (examples: list deliveries, create delivery, edit delivery, list items by warehouse).
2) Confirm you can log in and the UI works
   - If the UI is broken, you can’t capture the flows.
3) Confirm secrets handling
   - Captures must not store real tokens/passwords in clear text (redaction is required).

## Step-by-step (capture → contract → proxy → SDK → docs → ship)

### 1) Capture traffic through the proxy
Goal: produce real, repeatable capture files for the exact flows you care about.

1. Start proxy recording:
   - `cd API && PROXY_RECORD=1 npm start`
2. Use the website normally and exercise the flows you want to support.
3. Confirm recordings are being written:
   - You should see new files in `docs/captured-requests/runtime/`.
4. If you hit `EADDRINUSE` (port already in use):
   - Stop the other process or change the proxy port (then re-run).

What to capture (practical):
- At least 2 examples for critical endpoints (so you see optional fields change).
- One “happy path” and one “edge” example (empty search, different status filter, different item count).

### 2) Sanity-check captures (before generating anything)
Goal: ensure captures are usable and safe.

Checklist:
- Token redaction is present (no raw `Authorization` tokens).
- `proxy.method`, `proxy.path`, `proxy.query`, `proxy.body` look correct.
- Upstream errors are visible (you want to know if something consistently fails).

### 3) Generate the contract [observed fields map]
Goal: turn many capture files into a single summary of what we observed.

1. Run:
   - `node scripts/generate-endpoint-contracts.js`
2. Read:
   - `docs/endpoint-contract-summary.md`
3. Interpret:
   - `queryKeys` / `bodyKeys`: keys that appeared at least once.
   - `requiredQueryKeys` / `requiredBodyKeys`: keys that appeared in every capture for that method and were non-empty.
   - `statuses`: lets you see whether an endpoint regularly fails.

If an endpoint is missing from the contract:
- It was never called through the proxy (so it wasn’t captured).
- Or recording wasn’t enabled for that session.

### 4) Decide how to expose each upstream endpoint through the proxy
Goal: stable local API surface for your extension/app without leaking upstream credentials.

Two patterns:
1) Simple pass-through (default):
   - Use when the proxy should just forward query/body unchanged.
   - Implementation pattern: `proxyInferred(method, path, opts)`
2) Custom handler (when pass-through isn’t enough):
   - Use when you need:
     - stricter validation for safety
     - body transformation (e.g., sanitizing strings)
     - combining multiple upstream calls into one “task endpoint”
   - Example in this repo: custom `POST /api/createDelivery`.

### 5) Add proxy validation (conservative, evidence-based)
Goal: reject clearly broken requests early, without guessing upstream requirements.

Rules of thumb:
- Always validate identifier fields when observed (`id`, `user_id`, `ware_id`, etc.).
- Avoid “required paging/filter keys” unless you have a reason (those are often optional).
- Keep validation based on captures; if it wasn’t consistently present, don’t enforce it.

After changing validation:
- Re-generate the validation report (next step) so docs and behavior match.

### 6) Generate the validation report [what the proxy enforces]
Goal: create a single file API users can trust about what the proxy checks.

1. Run:
   - `node scripts/generate-validation-report.js`
2. Output:
   - `docs/validation-report.md`

### 7) Update docs (without assumptions)
Goal: API users understand “what to call, in what order” (flows), and “what’s validated”.

Update `docs/api-reference.md` to include:
- Endpoint catalog (routes, methods, purpose).
- Recommended workflows (by task), but only for captured endpoints.
- A “not yet captured” list for anything unverified.
- Link to `docs/validation-report.md`.

How to write a recommended workflow:
1) Start from the user action (what the UI does).
2) List the sequence of calls and what each returns (IDs needed for the next call).
3) Explicitly name the dynamic selections:
   - choose `user_id` (shop/customer), then choose `ware_id`, then choose `item.id`, then choose quantities.

### 8) Build and ship the SDK [client helper library]
Goal: publish a versioned package that matches proxy behavior.

1. Build:
   - `cd api-package && npm run build`
2. Bump version:
   - `npm version X.Y.Z --no-git-tag-version`
3. Publish:
   - `npm publish --access public`
   - If npm requires 2FA: `npm publish --access public --otp <code>`
4. Verify:
   - `npm view <package>@X.Y.Z version`

## Maintenance loop (when the provider changes)
When upstream changes or you add a new UI feature:
1) Capture again (`PROXY_RECORD=1`).
2) Regenerate contract + validation report.
3) Adjust proxy routes/validation to match new observed traffic.
4) Rebuild + bump + publish the SDK.
5) Update recommended workflows only when captured.

## Definition of done
- Captures exist for every endpoint you plan to support (through the proxy).
- Contract and validation report regenerate cleanly from captures.
- Proxy routes match observed methods and enforce only safe, evidence-based required fields.
- SDK is rebuilt from the current helpers and published; publish is verified on npm.
- Docs show workflows for captured endpoints, and clearly mark unverified areas.

## Common pitfalls (what breaks teams later)
- “Required” in the contract is “always observed,” not “required by upstream.”
- Dropping empty query params can change upstream behavior (empty string can be meaningful).
- Array query params (like `id[]`) need special handling; don’t flatten them incorrectly.
- Multipart uploads (file inputs) often don’t work via JSON forwarding.
- Auth tokens expire; you may need to recapture after re-login.
- Validation can become “too strict” and break real clients; keep it conservative.
