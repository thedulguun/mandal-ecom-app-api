# API Reference (Proxy + Provider)

Production-ready reference for the ebuuhia API when called through our Express proxy [middle server that forwards requests] or directly via the SDK [helper library].

## Quick start
- Start the proxy: `cd API && npm install && npm start` (default base `http://localhost:3000/api`).
- Login: `POST /api/login` with JSON `{"email":"","password":"","device_token":null}`; the proxy caches the returned `token` in memory.
- Call any endpoint with `Authorization: <token>` (raw token, no `Bearer` prefix). Example: `GET /api/deliveries?startLimit=0&endLimit=20`.
- Optionally clear the cached token with `POST /api/logout` (also pings `/getComment` and `/getComic` upstream as a sanity check).

## Base URLs & headers
- Proxy base: `http://localhost:${PORT || 3000}/api`
- Upstream base: `${EBUUHIA_BASE_URL || https://api.ebuuhia.mn/api/v1}` (trailing slash trimmed)
- Defaults: `Accept: application/json, text/plain, */*`, `Content-Type: application/json`; GET/HEAD requests do not send `Content-Type`.
- Auth: raw token in `Authorization`. If you omit the header, the proxy will reuse the cached login token when present; if neither exists, most endpoints return `401`.
- Public/no-auth endpoints: `/api/health`, `/api/login`, `/api/logout`, `/api/getComment`, `/api/getComic`.
- Upload caveat: `uploadExcelFile` and `upload-image` currently go through the JSON body path; use FormData in devtools/manual calls if the provider requires `multipart/form-data`.

## Response & error behavior
- The proxy forwards upstream status codes and bodies; it parses JSON when possible and returns raw text otherwise.
- Most endpoints return `401` when no token is available (via `Authorization` header or cached login token).
- Some endpoints return `400` for missing required query/body fields (for example, delete endpoints require `id`).
- Login replaces any cached token; logout wipes it.

## Validation rules enforced by the proxy
These checks are applied before forwarding to the provider. They are based on runtime captures; anything not listed here is not enforced yet.
Generated report: see `docs/validation-report.md` (run `node scripts/generate-validation-report.js` after updating captures).

### Required query params (GET)
- `/api/getById`: `id`, `table`
- `/api/getDelivery_items_by_id`: `id`
- `/api/getChat`: `delivery_id`, `user_id`
- `/api/getDeliveryChart`: `user_id`
- `/api/getDeliveryTotal`: `table`, `id`
- `/api/itemsById`: `id`
- `/api/getOrderCustomer`: `id`
- `/api/getDeliveryCustomer`: `id`
- `/api/reportCustomerByUser`: `id`
- `/api/getReportGeneralCustomerByUser`: `id`
- `/api/getReportWareByUser`: `id`
- `/api/getReportDashboard`: `user_id`
- `/api/getWareCustomer`: `id`
- `/api/getNotification`: `user_id`
- `/api/branchIdUserId`: `user_id`
- `/api/userById`: `user_id`
- `/api/wareByUserId`: `user_id`
- `/api/itemsByWareId`: `ware_id`
- `/api/getItemCustomer`: `id`

### Required body fields (POST/PATCH)
- `POST /api/login`: `email`, `password`
- `POST /api/createChat`: `user_id`, `delivery_id`, `comment`
- `POST /api/createItem`: `name`, `price`, `staff`, `user_id`, `ware_id`
- `PATCH /api/editDelivery`: `id`
- `PATCH /api/editUser`: `id`

## Captures & tools
- Real captured requests live in `docs/captured-requests/`; ad-hoc logs accumulate in `api-call-log.json`.
- `api-test.html` hits the proxy by default so you can login and try endpoints from the browser.

## Endpoint catalog
All proxy routes are prefixed with `/api`; the upstream path is the same string without the `/api` prefix. Most list endpoints accept the usual paging/search params (`startLimit`, `endLimit`, `order`, `sort`, `search`, `value`, `status`, `id`, `action`).

### Auth & health
| Proxy route | Method | Upstream path | Purpose | Notes |
| --- | --- | --- | --- | --- |
| `/api/health` | GET | — (local only) | Liveness check | No auth |
| `/api/login` | POST | `/login` | Obtain session token | Body: `email`, `password`, optional `device_token` |
| `/api/logout` | POST | `/getComment`, `/getComic` | Clears cached token; pings two read endpoints | No auth required |

### Deliveries
| Proxy route | Method | Upstream path | Purpose | Key params/body | UI button (Next snapshot) |
| --- | --- | --- | --- | --- | --- |
| `/api/deliveries` | GET | `/getDeliveryCustomer` | Convenience delivery list with defaults + auth guard | `startLimit`, `endLimit`, `order`, `sort`, `search`, `value`, `status`, `id`, `action` | Filters (Төлөв/Бүс/Жолооч/Харилцагч/Search) refetch list |
| `/api/delivery` | GET | `/delivery` | Delivery list (raw) | Paging/search params | Filters (admin/manager/operator) |
| `/api/deliveryWithArchive` | GET | `/deliveryWithArchive` | Deliveries including archive | Paging/search params | — |
| `/api/getDelivery_items_by_id` | GET | `/getDelivery_items_by_id` | Items for a delivery | `delivery_id` or `id[]` | Delivery detail view |
| `/api/getDelivery_items` | GET | `/getDelivery_items` | Delivery items list | Paging/search params | Delivery detail view |
| `/api/getDeliveryCustomer` | GET | `/getDeliveryCustomer` | Delivery list by customer/user | Same params as `/api/deliveries` | Customer list filters |
| `/api/checkDelivery` | GET | `/checkDelivery` | Validate a delivery by code/id | `code`/`id` (provider-specific) | Delivery detail (check list) |
| `/api/getChat` | GET | `/getChat` | Fetch chat for a delivery | `delivery_id` | Delivery chat drawer |
| `/api/getDeliveryChart` | GET | `/getDeliveryChart` | Chart/summary counts | `user_id` | Dashboard widgets |
| `/api/getDeliveryTotal` | GET | `/getDeliveryTotal` | Totals by table (delivery/orders/report_cus) | `table`, `id` | Dashboard widgets |
| `/api/createDelivery` | POST | `/createDelivery` | Create a delivery | Body: customer/contact, address, items, `user_id`, `staff`, etc. | `Шинэ хүргэлт бүртгэх` → Save |
| `/api/editDelivery` | PATCH | `/editDelivery` | Update delivery details | Body mirrors create; supply id fields expected by provider | Detail `Хадгалах` |
| `/api/editReceivedMoney` | PATCH | `/editReceivedMoney` | Adjust received payment | Body with delivery/payment info | Detail save |
| `/api/editDesc` | PATCH | `/editDesc` | Update delivery description | Body with id + `deli_desc` | Detail save |
| `/api/verify` | PATCH | `/verify` | Mark delivery verified | Body with id/status | Detail save |
| `/api/uploadExcelFile` | POST | `/uploadExcelFile` | Bulk import from Excel | Use FormData if upstream requires multipart | Excel upload in detail |
| `/api/createChat` | POST | `/createChat` | Add chat message to delivery | Body with delivery/message fields | Chat send button |

### Orders
| Proxy route | Method | Upstream path | Purpose | Key params/body | UI button (Next snapshot) |
| --- | --- | --- | --- | --- | --- |
| `/api/order` | GET | `/order` | Order list | Paging/search params | Filters (Төлөв/Бүс/Жолооч/Харилцагч/Search) refetch list |
| `/api/orderArchive` | GET | `/orderArchive` | Archived orders | Paging/search params | — |
| `/api/receivedDriver` | GET | `/receivedDriver` | Orders received by driver | Paging/search params | — |
| `/api/finishedOrder` | GET | `/finishedOrder` | Completed orders | Paging/search params | — |
| `/api/reportOrder` | GET | `/reportOrder` | Order reporting view | Paging/search params | — |
| `/api/getOrderCustomer` | GET | `/getOrderCustomer` | Orders by customer/user | `startLimit`, `endLimit`, `status`, `id`, etc. | Customer list filters |
| `/api/getById` | GET | `/getById` | Fetch single order by id | `id` | Order detail load |
| `/api/changeStatus2` | PATCH | `/changeStatus2` | Update order status (variant 2) | Body with order/status fields | `Жолооч солих` / status change bulk |
| `/api/changeStatus` | PATCH | `/changeStatus` | Update order status | Body with order/status fields | `Төлөв солих` bulk |
| `/api/changeRegion` | PATCH | `/changeRegion` | Change order region | Body with region fields | `Бүс солих` bulk |
| `/api/changeRegionOrder` | PATCH | `/changeRegionOrder` | Update order region (alternate) | Body with region fields | `Бүс солих` bulk |
| `/api/editOrder` | PATCH | `/editOrder` | Edit order details | Body with order fields | Detail `Хадгалах` |
| `/api/changeStatusQR` | PATCH | `/changeStatusQR` | Update status via QR flow | Body with order/status fields | — |
| `/api/changeStatusQR` | POST | `/changeStatusQR` | Update status via QR flow (alternate) | Body or params (provider-specific) | — |
| `/api/createOrder` | POST | `/createOrder` | Create an order | Body with customer/items/region fields | `Шинэ захиалга бүртгэх` → Save |

### Users, branches, access
| Proxy route | Method | Upstream path | Purpose | Key params/body |
| --- | --- | --- | --- | --- |
| `/api/users` | GET | `/users` | List users | Paging/search params |
| `/api/userById` | GET | `/userById` | Get user detail | `user_id` |
| `/api/driver` | GET | `/driver` | List drivers | Paging/search params |
| `/api/getBranch` | GET | `/getBranch` | List branches | Paging/search params |
| `/api/branchById` | GET | `/branchById` | Branch detail | `branch_id` |
| `/api/branchIdUserId` | GET | `/branchIdUserId` | Branches for user | `user_id` |
| `/api/roles` | GET | `/roles` | List roles | Paging/search params |
| `/api/region` | GET | `/region` | Regions list | Paging/search params |
| `/api/khoroo` | GET | `/khoroo` | Khoroo list | Paging/search params |
| `/api/globalSearch` | GET | `/globalSearch` | Global search across entities | `search`, paging params |
| `/api/wareByUserId` | GET | `/wareByUserId` | Warehouses for user | `user_id` |
| `/api/createUser` | POST | `/createUser` | Create user | Body with user fields |
| `/api/createBranch` | POST | `/createBranch` | Create branch | Body with branch fields |
| `/api/createDriver` | POST | `/createDriver` | Create driver | Body with driver fields |
| `/api/editUser` | PATCH | `/editUser` | Update user | Body with user fields |
| `/api/editBranch` | PATCH | `/editBranch` | Update branch | Body with branch fields |
| `/api/approve` | PATCH | `/approve` | Approve user | Body with user/approval fields |
| `/api/approveBranch` | PATCH | `/approveBranch` | Approve branch | Body with branch/approval fields |
| `/api/changePassword` | PATCH | `/changePassword` | Change password | Body with credentials |
| `/api/resetPassword` | POST | `/resetPassword` | Reset password | Body with reset fields |
| `/api/reset-password` | POST | `/reset-password` | Alternate reset password | Body with reset fields |
| `/api/changeDans` | PATCH | `/changeDans` | Update DAN/S number | Body with user fields |
| `/api/createRole` | POST | `/createRole` | Create role | Body with role fields |
| `/api/createRegion` | POST | `/createRegion` | Create region | Body with region fields |
| `/api/createKhoroo` | POST | `/createKhoroo` | Create khoroo | Body with khoroo fields |

### Inventory & items
| Proxy route | Method | Upstream path | Purpose | Key params/body |
| --- | --- | --- | --- | --- |
| `/api/items` | GET | `/items` | Item list | Paging/search params |
| `/api/itemsById` | GET | `/itemsById` | Items by id array | `id[]` |
| `/api/itemsByWareId` | GET | `/itemsByWareId` | Items for a warehouse | `ware_id` |
| `/api/getWareCustomer` | GET | `/getWareCustomer` | Warehouses for a customer/user | `id`, paging |
| `/api/getItemCustomer` | GET | `/getItemCustomer` | Customer items list | Paging/search params |
| `/api/getGroupItem` | GET | `/getGroupItem` | Item grouping metadata | Paging/search params |
| `/api/getCustomerReportDetail` | GET | `/getCustomerReportDetail` | Detailed customer item report | Customer/report params |
| `/api/getReturnedItem` | GET | `/getReturnedItem` | Returned items list | Paging/search params |
| `/api/createItem` | POST | `/createItem` | Create item | Body with item fields |
| `/api/createWare` | POST | `/createWare` | Create warehouse | Body with ware fields |
| `/api/addItem` | POST | `/addItem` | Add item to ware | Body with item/ware fields |
| `/api/bundleItem` | POST | `/bundleItem` | Bundle items | Body with item grouping |
| `/api/prepareItem` | GET | `/prepareItem` | Prepared items list | Paging/search params |
| `/api/readyItem` | GET | `/readyItem` | Ready items list | Paging/search params |
| `/api/prepareItem` | POST | `/prepareItem` | Prepare item for delivery | Body with item/delivery fields |
| `/api/readyItem` | POST | `/readyItem` | Mark item ready | Body with item fields |
| `/api/editItem` | PATCH | `/editItem` | Update item | Body with item fields |
| `/api/editItemQuantity` | PATCH | `/editItemQuantity` | Adjust quantity | Body with quantity fields |
| `/api/editPay` | PATCH | `/editPay` | Adjust payment | Body with payment fields |
| `/api/editCash` | PATCH | `/editCash` | Adjust cash fields | Body with cash fields |
| `/api/editStart` | PATCH | `/editStart` | Update start info | Body with start fields |
| `/api/editEnd` | PATCH | `/editEnd` | Update end info | Body with end fields |
| `/api/editAccount` | PATCH | `/editAccount` | Update account/billing info | Body with account fields |
| `/api/editWare` | PATCH | `/editWare` | Update ware/warehouse | Body with ware fields |

### Reports & dashboard
| Proxy route | Method | Upstream path | Purpose | Key params/body |
| --- | --- | --- | --- | --- |
| `/api/getReportDashboard` | GET | `/getReportDashboard` | Dashboard metrics | `user_id` |
| `/api/getReportWareByUser` | GET | `/getReportWareByUser` | Ware report by user | `id`, paging |
| `/api/getReportGeneralCustomerByUser` | GET | `/getReportGeneralCustomerByUser` | General customer report | `id`, paging |
| `/api/reportCustomerByUser` | GET | `/reportCustomerByUser` | Customer report (reported flag) | `reported`, `id`, paging |
| `/api/getReportCustomerMoney` | GET | `/getReportCustomerMoney` | Customer payment report | Report params |
| `/api/getReportDriverMoney` | GET | `/getReportDriverMoney` | Driver payment report | Report params |
| `/api/getReportDriverMoneyDone` | GET | `/getReportDriverMoneyDone` | Driver payment done | Report params |
| `/api/getReportGeneralCustomer` | GET | `/getReportGeneralCustomer` | General customer totals | Report params |
| `/api/getReportGeneralDriver` | GET | `/getReportGeneralDriver` | General driver totals | Report params |
| `/api/getReportWare` | GET | `/getReportWare` | Ware/warehouse report | Report params |
| `/api/reportCustomer` | GET | `/reportCustomer` | Customer report list | Paging/search params |
| `/api/reportDone` | GET | `/reportDone` | Completed reports | Paging/search params |
| `/api/reportDoneCustomer` | GET | `/reportDoneCustomer` | Completed customer reports | Paging/search params |
| `/api/reportDriver` | GET | `/reportDriver` | Driver reports | Paging/search params |
| `/api/reportRestore` | GET | `/reportRestore` | Restore report entries | Paging/search params |
| `/api/getDeliveryChart` | GET | `/getDeliveryChart` | Delivery chart data | `user_id` |
| `/api/getDeliveryTotal` | GET | `/getDeliveryTotal` | Delivery totals | `table`, `id` |
| `/api/getPrintReportGeneralDriver` | GET | `/getPrintReportGeneralDriver` | Printable driver report | Report params |
| `/api/getReportDriverExcel` | GET | `/getReportDriverExcel` | Driver report export | Report params |
| `/api/getReportCustomerExcel` | GET | `/getReportCustomerExcel` | Customer report export | Report params |
| `/api/getReportWareSelect` | GET | `/getReportWareSelect` | Ware selection export | Report params |

### Messaging, notifications, print/export
| Proxy route | Method | Upstream path | Purpose | Key params/body |
| --- | --- | --- | --- | --- |
| `/api/getComic` | GET | `/getComic` | List comics/help entries | Paging/search params |
| `/api/getComment` | GET | `/getComment` | List comments | Paging/search params |
| `/api/getNotification` | GET | `/getNotification` | List notifications | Paging/search params |
| `/api/createComic` | POST | `/createComic` | Create comic/help entry | Body with content fields |
| `/api/createComment` | POST | `/createComment` | Create comment | Body with comment fields |
| `/api/upload-image` | POST | `/upload-image` | Upload image | Use FormData if upstream expects file upload |
| `/api/getByIdForPrint` | GET | `/getByIdForPrint` | Printable order | `id` |
| `/api/getByIdForPrintDelivery` | GET | `/getByIdForPrintDelivery` | Printable delivery | `id` |

### Delete operations
| Proxy route | Method | Upstream path | Purpose | Key params/body |
| --- | --- | --- | --- | --- |
| `/api/delete` | DELETE | `/delete` | Generic delete | `id` + context fields |
| `/api/deleteOrder` | DELETE | `/deleteOrder` | Delete order | `id` |
| `/api/deleteItem` | DELETE | `/deleteItem` | Delete item | `id` |
| `/api/deleteDelivery` | DELETE | `/deleteDelivery` | Delete delivery | `id` |
| `/api/deleteBranch` | DELETE | `/deleteBranch` | Delete branch | `id` |
| `/api/deleteUser` | DELETE | `/deleteUser` | Delete user | `id` |
| `/api/deleteWare` | DELETE | `/deleteWare` | Delete ware/warehouse | `id` |

## Recommended workflows (by task)
These are practical “recipes” (step-by-step sequences) based only on runtime captures in `docs/captured-requests/runtime`. If an endpoint is not mentioned here, it has not been captured yet and its fields are still unverified.

### Delivery: create (warehouse + items + customer form)
Use these four proxy calls to build a delivery without exposing provider credentials:

1) Choose warehouse: `GET /api/wareByUserId?user_id=<customerId>` → user picks a `ware_id`.
2) Choose items from that warehouse: `GET /api/itemsByWareId?ware_id=<ware_id>`; for details/pricing call `GET /api/itemsById?id[]=<itemId>`. Build `items: [{ id: "<itemId>", start: <quantity> }]`.
3) Fill customer + address fields (captured on create):
   - Contact: `cus_name`, `cus_phone`, optional `cus_phone1`.
   - Address: `city`, `district`, `committee`, `town`, `street`, `toot`, `addition`.
   - Meta: `type`, `item_type`, `deli_desc`, optional `total_price`, `send_message`, optional manual item fields (`item_name`, `quantity`, `size`, `weight`) if not using stock items.
4) Create delivery: `POST /api/createDelivery` with `user_id`, `items` array (from step 2) or manual item fields, the contact/address/meta fields above, and `staff` (operator name). The proxy forwards upstream and keeps the provider token server-side.

### Delivery: view details + chat
1) Get delivery detail: `GET /api/getById?id=<deliveryId>&table=delivery`.
2) Get delivery items: `GET /api/getDelivery_items_by_id?id=<deliveryId>`.
3) Load chat: `GET /api/getChat?delivery_id=<deliveryCodeOrId>&user_id=<userId>`.
4) Send a message: `POST /api/createChat` with `user_id`, `delivery_id`, `comment`.

### Delivery: update fields (captured)
1) Update delivery fields: `PATCH /api/editDelivery` with the delivery `id` plus changed fields.
2) Additional update endpoints (`/api/editDesc`, `/api/editReceivedMoney`, `/api/verify`) are not yet captured.

### Orders: browse + detail (captured)
1) List orders by customer/user: `GET /api/getOrderCustomer` with paging/search params (`startLimit`, `endLimit`, `status`, `id`, `order`, `sort`, `search`, `value`).
2) Load a single record: `GET /api/getById?id=<orderId>&table=orders`.
3) Create/edit/status/region changes are not yet captured for orders.

### Inventory: warehouses + items (captured)
Common patterns (used by delivery create):
1) List warehouses for a shop/user: `GET /api/wareByUserId?user_id=<userId>`.
2) List items in a warehouse: `GET /api/itemsByWareId?ware_id=<wareId>`.
3) Get item details/prices: `GET /api/itemsById?id[]=<itemId>` (repeat `id[]` for multiple).
4) Create an item: `POST /api/createItem` with `img`, `name`, `price`, `staff`, `user_id`, `ware_id`.
5) Other inventory actions (create ware, add/bundle, prepare/ready, edits) are not yet captured.

### Users/branches: view + edit (captured)
1) Get user details: `GET /api/userById?user_id=<userId>`.
2) Edit user: `PATCH /api/editUser` with the fields captured (`email`, `first_name`, `last_name`, `phone`, `phone1`, `r_d`, `shop_name`, `staff`, `id`).
3) Branches for a user: `GET /api/branchIdUserId?user_id=<userId>`.
4) User/branch creation, approvals, password changes are not yet captured.

### Reports + dashboard (captured)
1) Dashboard widgets: `GET /api/getReportDashboard?user_id=<userId>`, `GET /api/getDeliveryChart?user_id=<userId>`, `GET /api/getDeliveryTotal?table=<name>&id=<userId>`.
2) Reports by user: `GET /api/getReportWareByUser`, `GET /api/getReportGeneralCustomerByUser`, `GET /api/reportCustomerByUser` (paging/search params vary).
3) Exports/print endpoints are not yet captured.

### Notifications + web help (captured)
1) Notifications: `GET /api/getNotification?user_id=<userId>`.
2) Web help content: `GET /api/getComic`, `GET /api/getComment` (public/no-auth).
3) Admin help actions (`/api/createComic`, `/api/createComment`) are not yet captured.

### Deletes (captured)
- Delete delivery: `DELETE /api/deleteDelivery?id=<id>&staff=<staff>`.
- Generic and other delete endpoints are not yet captured.

### Not yet captured endpoints (no verified flow yet)
Use captures before documenting fields or workflows for these:
- Orders: `/api/order`, `/api/orderArchive`, `/api/receivedDriver`, `/api/finishedOrder`, `/api/reportOrder`, `/api/createOrder`, `/api/changeStatus`, `/api/changeStatus2`, `/api/changeStatusQR`, `/api/changeRegion`, `/api/changeRegionOrder`, `/api/editOrder`.
- Delivery: `/api/delivery`, `/api/deliveryWithArchive`, `/api/getDelivery_items`, `/api/checkDelivery`, `/api/editDesc`, `/api/editReceivedMoney`, `/api/verify`, `/api/uploadExcelFile`, `/api/deliveries`.
- Users/branches/roles/region: `/api/users`, `/api/driver`, `/api/getBranch`, `/api/roles`, `/api/region`, `/api/khoroo`, `/api/globalSearch`, `/api/branchById`, `/api/createUser`, `/api/createBranch`, `/api/createDriver`, `/api/resetPassword`, `/api/reset-password`, `/api/createRole`, `/api/createRegion`, `/api/createKhoroo`, `/api/editBranch`, `/api/approve`, `/api/approveBranch`, `/api/changePassword`, `/api/changeDans`.
- Inventory/items: `/api/items`, `/api/getReturnedItem`, `/api/getGroupItem`, `/api/getCustomerReportDetail`, `/api/prepareItem`, `/api/readyItem`, `/api/createWare`, `/api/addItem`, `/api/bundleItem`, `/api/editItem`, `/api/editItemQuantity`, `/api/editPay`, `/api/editCash`, `/api/editStart`, `/api/editEnd`, `/api/editAccount`, `/api/editWare`.
- Reports/exports: `/api/getReportCustomerMoney`, `/api/getReportDriverMoney`, `/api/getReportDriverMoneyDone`, `/api/getReportGeneralCustomer`, `/api/getReportGeneralDriver`, `/api/getReportWare`, `/api/reportCustomer`, `/api/reportDone`, `/api/reportDoneCustomer`, `/api/reportDriver`, `/api/reportRestore`, `/api/getByIdForPrint`, `/api/getByIdForPrintDelivery`, `/api/getPrintReportGeneralDriver`, `/api/getReportDriverExcel`, `/api/getReportCustomerExcel`, `/api/getReportWareSelect`.
- Web help: `/api/createComic`, `/api/createComment`, `/api/upload-image`.
- Misc: `/api/delete`, `/api/deleteOrder`, `/api/deleteItem`, `/api/deleteBranch`, `/api/deleteUser`, `/api/deleteWare`, `/api/logout`.

### Proxy checklist (applies to all workflows)
- Auth (token): call `POST /api/login` once and then send `Authorization: <token>` with requests (or rely on the proxy’s cached token).
- Validation: some endpoints return `400` if required query/body fields are missing (for example `id` for delete routes).
- Errors: the proxy forwards upstream status codes/bodies and logs upstream failures server-side for debugging.

## UI buttons (local Next snapshot -> API calls)
Button labels from the captured Next.js static build and the API calls they trigger. Useful when someone asks “what does this button hit?”.
Note: some of these endpoints are not yet captured in runtime, so their request fields are still unverified.

### Delivery screens
- `Шинэ хүргэлт бүртгэх` (New delivery) — opens create form; save submits `POST /createDelivery`.
- `Төлөв солих` (Change status, bulk) — submits `PATCH /changeStatus` with `table=delivery` (values include `2` for “Хүлээн авсан”/Received).
- Delivery list filters (`Төлөв`, `Бүс`, `Жолооч`, `Харилцагч`, dates, search) — refetch `GET /delivery` (admin/manager/operator) or `GET /getDeliveryCustomer` (customer) with those query params.
- Delivery detail `Хадгалах` (Save) — `PATCH /editDelivery`; supporting actions inside detail use the same service: `PATCH /editReceivedMoney`, `PATCH /editDesc`, `PATCH /verify`, `POST /createChat`, `POST /uploadExcelFile`, `POST /changeStatusQR` (bulk print/QR), `GET /getDelivery_items_by_id`.

### Order screens
- `Шинэ захиалга бүртгэх` (New order) — opens create form; save submits `POST /createOrder`.
- `Төлөв солих` (Change status, bulk) — `PATCH /changeStatus` with `table=orders` (values include `1` “Бүртгэгдсэн”, `3` “Жолооч хүлээн авсан”).
- `Бүс солих` (Change region, bulk) — `PATCH /changeRegionOrder`.
- `Жолооч солих` (Change driver, bulk) — `PATCH /changeStatus2` with driver info.
- `Устгах` (Delete, bulk) — `DELETE /deleteOrder`.
- Order list filters (`Төлөв`, `Бүс`, `Жолооч`, `Харилцагч`, dates, search) — refetch `GET /order` (admin/manager/operator) or `GET /getOrderCustomer` (customer) with those query params.
- Order detail `Хадгалах` (Save) — `PATCH /editOrder`; detail load uses `GET /getById?table=orders`.

## Adding new endpoints
- Add the path/method to `API/index.js` (and to `scripts/inferred-endpoints.json` + regenerate helpers if you want SDK coverage).
- Capture at least one real request/response under `docs/captured-requests/` and log new calls in `api-call-log.json` for traceability.
- Update this reference with the new route description so consumers know how to call it.
