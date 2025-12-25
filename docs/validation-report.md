# Validation Report (Proxy)

Generated: 2025-12-25T15:02:47.010Z
Contract: docs/endpoint-contract.json
Contract generated: 2025-12-25T15:02:46.503Z
Source: docs/captured-requests/runtime

Rule: required keys are those present in every capture for a method and non-empty. Missing endpoints are not listed.

## Enforced fields (observed)
- /api/branchIdUserId
  - GET: query: user_id
- /api/createChat
  - POST: body: comment, delivery_id, user_id
- /api/createDelivery
  - POST: body: addition, cus_name, cus_phone, cus_phone1, items, send_message, staff, type, user_id
- /api/createItem
  - POST: body: name, price, staff, user_id, ware_id
- /api/deleteDelivery
  - DELETE: query: id, staff
- /api/editDelivery
  - PATCH: body: addition, code, cus_name, cus_phone, cus_phone1, id, item_type, staff, type
- /api/editUser
  - PATCH: body: email, first_name, id, last_name, phone, phone1, r_d, shop_name, staff
- /api/getById
  - GET: query: id, table
- /api/getChat
  - GET: query: delivery_id, user_id
- /api/getDelivery_items_by_id
  - GET: query: id
- /api/getDeliveryChart
  - GET: query: user_id
- /api/getDeliveryCustomer
  - GET: query: endLimit, id, sort, startLimit, status
- /api/getDeliveryTotal
  - GET: query: id, table
- /api/getItemCustomer
  - GET: query: endLimit, id, sort, startLimit
- /api/getNotification
  - GET: query: user_id
- /api/getOrderCustomer
  - GET: query: endLimit, id, sort, startLimit, status
- /api/getReportDashboard
  - GET: query: user_id
- /api/getReportGeneralCustomerByUser
  - GET: query: endLimit, id, sort, startLimit
- /api/getReportWareByUser
  - GET: query: endLimit, id, sort, startLimit
- /api/getWareCustomer
  - GET: query: id, sort
- /api/itemsById
  - GET: query: id
- /api/itemsByWareId
  - GET: query: ware_id
- /api/login
  - POST: body: email, password
- /api/reportCustomerByUser
  - GET: query: action, endLimit, id, reported, sort, startLimit
- /api/userById
  - GET: query: user_id
- /api/wareByUserId
  - GET: query: user_id

## Omitted endpoints (3)
No required fields observed in runtime captures for these endpoints.
- /api/getComic
- /api/getComment
- /api/health
