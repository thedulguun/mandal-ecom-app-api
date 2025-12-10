# mandal-ebuuhia-sdk (scaffold)

Ship-ready client SDK for calling the Ebuuhia proxy/provider.

## What’s here
- `src/config.js` — set/get base URL and token; build auth headers.
- `src/http.js` — tiny fetch wrapper that uses the config.
- `src/helpers/` — place your generated helpers here (copy from `client/generated/...`).
- `src/convenience.js` — grouped helpers and shortcuts (configure, loginAndSetToken).
- `src/index.js` — export config + helpers + conveniences.

## How to use (once helpers are in place)
```js
import { setBaseUrl, setToken, deliveryList, helpersByDomain, loginAndSetToken, configure } from 'mandal-ebuuhia-sdk';

setBaseUrl('http://localhost:3000/api'); // or provider URL
setToken('<jwt>');

const res = await deliveryList({ query: { startLimit: 0, endLimit: 10 } });
console.log(res.status, res.data);

// Convenience examples
configure({ baseUrl: 'http://localhost:3000/api', token: '<jwt>' });
await loginAndSetToken({ body: { email, password } });
console.log(helpersByDomain.delivery.deliveryList); // namespaced helper
```

## Next steps to make this shippable
- Copy helpers from `client/generated/from-captures.js` and `client/generated/inferred.js` into `src/helpers/`.
- Wire those helpers to the `http` wrapper.
- Add a real build step (esbuild/rollup) to emit `dist/` ESM/CJS bundles.
- Add minimal tests or smoke scripts if desired.
