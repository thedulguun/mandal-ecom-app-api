# Create Delivery Flow (UI + Payload)

This doc describes the recommended **form structure** and **item add flow** used to build the `createDelivery` request body.

## Form structure

### Base / Auth
- **Email + Password** → `POST /login` to obtain `token`, `user_id`, and `staff` (from `user.last_name`).
- Store these locally and reuse for subsequent calls.
- Login response shape we see in production:
  - `data` contains an array; the first entry is the user record.
  - Use `data[0].user_id` for `user_id` and `data[0].last_name` for `staff`.
  - `token` may be returned separately in other responses (see token handling below).

### Required fields (always visible)
- `cus_name`
- `cus_phone`
- `addition` (full address notes)

### Optional fields (collapsed)
- `cus_phone1`
- `deli_desc`
- `item_type` (one of: `Хайлна`, `Хөлдөнө`, `Сэгсэрч болохгүй`, `Хагарна`)

### Advanced fields (nested collapsed)
- `city`, `district`, `committee`, `town`, `street`, `toot`
- `item_name`, `quantity`, `size`, `weight`
- `type` (default `Энгийн`)
- `total_price`

### Hidden/default fields
- `user_id` (from login)
- `staff` (from login)
- `send_message` default `false`
- Token handling: if any API response includes a top-level `token`, refresh the stored token and use it for subsequent calls.

### API-required fields (payload validation)
These fields are required by the API [service interface] when creating a delivery. Some are filled by defaults or hidden form values.
- `addition`
- `cus_name`
- `cus_phone`
- `cus_phone1`
- `items` (array of `{ id, start }`)
- `send_message`
- `staff`
- `type`
- `user_id`

## Item add flow (warehouse → items → cart)

1) **Load warehouses**
   - `GET /wareByUserId?user_id=<user_id>`
   - Populate the warehouse selector.

2) **Load items for selected warehouse**
   - `GET /itemsByWareId?ware_id=<ware_id>`
   - Populate the item selector.

3) **Fetch accurate item price**
   - `GET /itemsById?id[]=<item_id>`
   - Use this to display price in the UI.
   - Note: `itemsByWareId` responses may not include price fields, so prefer `itemsById` for pricing.
   - Known response shape (itemsById):
     - `data` is an array; price is in `data[0].price`.

4) **Add item to cart**
   - User picks an item + quantity.
   - Append to payload `items` array as:
     ```json
     { "id": "<item_id>", "start": <qty> }
     ```

5) **Cart UI**
   - Display each row: `item_id`, `quantity`, `price`, remove button.
   - Price display uses `unit_price × quantity`.
   - Total price is the sum of all item row totals.

## Create delivery payload (example)
```json
{
  "user_id": 2015,
  "cus_name": "Receiver",
  "cus_phone": "99999999",
  "cus_phone1": "88888888",
  "addition": "Full address",
  "deli_desc": "Optional note",
  "item_type": "Хагарна",
  "items": [{ "id": "5125", "start": 2 }],
  "staff": "ShopLastName",
  "send_message": false,
  "city": null,
  "district": null,
  "committee": null,
  "town": "",
  "street": "",
  "toot": "",
  "item_name": "",
  "quantity": null,
  "size": "",
  "weight": "",
  "type": "Энгийн",
  "total_price": null
}
```

## SDK helper mapping (form → payload)
If you use the SDK [helper library], you can build the payload [request body] from form values with `buildCreateDeliveryBody`.
```js
import { buildCreateDeliveryBody, deliveryCreate } from 'mandal-ebuuhia-sdk';

const body = buildCreateDeliveryBody({
  userId: 2015,
  staff: 'ShopLastName',
  type: 'Энгийн',
  sendMessage: false,
  customer: { name: 'Receiver', phone: '99999999', phone1: '88888888' },
  address: { addition: 'Full address' },
  items: [{ id: '5125', start: 2 }],
  item: { type: 'Хагарна', desc: 'Optional note' }
});

await deliveryCreate({ body });
```
