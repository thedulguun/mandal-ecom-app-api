# mandal-ebuuhia-sdk

Client SDK for calling the Ebuuhia proxy (or provider). Ship-ready with ESM/CJS builds.

## What’s here
- `src/config.js` — set/get base URL and token; build auth headers.
- `src/http.js` — tiny fetch wrapper that uses the config.
- `src/helpers/` — generated helpers (from captures + inferred endpoints).
- `src/convenience.js` — grouped helpers and shortcuts (configure, loginAndSetToken, helpersByDomain).
- `dist/` — bundled ESM/CJS outputs.

## Quick start (use the proxy base)
```js
import {
  setBaseUrl,
  setToken,
  deliveryList,
  deliveryCreate,
  itemsByWareId,
  wareByUserId,
  helpersByDomain,
  loginAndSetToken,
  configure,
  buildCreateDeliveryBody
} from 'mandal-ebuuhia-sdk';

setBaseUrl('http://localhost:3000/api'); // proxy hides provider creds
setToken('<token-from-login>');

// List deliveries
const list = await deliveryList({ query: { startLimit: 0, endLimit: 10 } });
console.log(list.status, list.data);

// Create delivery (warehouse + items + contact/address)
const wares = await wareByUserId({ query: { user_id: 2015 } });
const items = await itemsByWareId({ query: { ware_id: wares.data?.[0]?.id } });
const body = buildCreateDeliveryBody({
  userId: 2015,
  staff: 'Operator',
  type: 'Энгийн',
  sendMessage: false,
  customer: { name: 'Receiver', phone: '123', phone1: '123' },
  address: { addition: 'Entrance code 1234' },
  items: [{ id: items.data?.[0]?.id, start: 1 }],
  item: { type: 'Хагарна' }
});
const create = await deliveryCreate({ body });
console.log(create.status, create.data);

// Convenience examples
configure({ baseUrl: 'http://localhost:3000/api', token: '<token>' });
await loginAndSetToken({ body: { email, password } });
console.log(helpersByDomain.delivery.deliveryList); // namespaced helper
```

## Build
- `npm run build` → sync helpers + emit `dist/index.js` (ESM) and `dist/index.cjs` (CJS).
