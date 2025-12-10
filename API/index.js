/* Simple Express proxy for ebuuhia API.
 * Stores the upstream token in memory and forwards requests from the browser.
 */

const express = require('express');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const PROVIDER_BASE =
  (process.env.EBUUHIA_BASE_URL || 'https://api.ebuuhia.mn/api/v1').replace(/\/$/, '');

let upstreamToken = '';

const app = express();
app.use(cors());
app.use(express.json());

const buildUrl = (path, query) => {
  const cleanPath = (path || '').replace(/^\//, '');
  const url = new URL(`${PROVIDER_BASE}/${cleanPath}`);
  if (query) {
    Object.entries(query).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        url.searchParams.set(key, val);
      }
    });
  }
  return url.toString();
};

const parseBody = async (res) => {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const forward = async ({ path, method = 'GET', headers = {}, query, body }) => {
  const url = buildUrl(path, query);
  const options = { method, headers: { Accept: 'application/json, text/plain, */*', ...headers } };
  const hasBody =
    body !== undefined &&
    body !== null &&
    method.toUpperCase() !== 'GET' &&
    method.toUpperCase() !== 'HEAD' &&
    (typeof body === 'string' ? body.length > 0 : Object.keys(body || {}).length > 0);
  if (hasBody) {
    options.body = typeof body === 'string' ? body : JSON.stringify(body);
    options.headers['Content-Type'] = 'application/json';
  } else {
    // Ensure no Content-Type on GET/HEAD or empty body
    delete options.headers['Content-Type'];
  }
  const res = await fetch(url, options);
  const data = await parseBody(res);
  return { status: res.status, ok: res.ok, data };
};

const handleError = (res, error) => {
  const message = error?.message || 'Proxy error';
  res.status(500).json({ error: message });
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/login', async (req, res) => {
  try {
    const upstream = await forward({
      path: 'login',
      method: 'POST',
      body: {
        email: req.body?.email,
        password: req.body?.password,
        device_token: req.body?.device_token ?? null
      }
    });
    const token = upstream?.data?.token || upstream?.data?.data?.token;
    if (token) upstreamToken = token;
    res.status(upstream.status).json(upstream.data ?? {});
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/deliveries', async (req, res) => {
  try {
    const token = req.headers.authorization || upstreamToken;
    if (!token) {
      res.status(401).json({ error: 'Login first to obtain a token.' });
      return;
    }
    const upstream = await forward({
      path: 'getDeliveryCustomer',
      method: 'GET',
      query: {
        startLimit: req.query.startLimit ?? 0,
        endLimit: req.query.endLimit ?? 100,
        order: req.query.order ?? '',
        sort: req.query.sort ?? 'asc',
        search: req.query.search ?? '',
        value: req.query.value ?? '',
        status: req.query.status ?? 100,
        id: req.query.id ?? '',
        action: req.query.action ?? 0
      },
      headers: { Authorization: token }
    });
    res.status(upstream.status).json(upstream.data ?? {});
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/logout', async (_req, res) => {
  try {
    const endpoints = ['getComment', 'getComic'];
    const results = [];
    for (const path of endpoints) {
      try {
        const upstream = await forward({ path, method: 'GET' });
        results.push({ path, ok: upstream.ok, status: upstream.status, data: upstream.data });
      } catch (error) {
        results.push({ path, ok: false, error: error?.message || 'request failed' });
      }
    }
    upstreamToken = '';
    res.json({ results });
  } catch (error) {
    handleError(res, error);
  }
});

// Proxy inferred endpoints: simple pass-through; token can be provided or uses cached upstreamToken.
const proxyInferred = (method, path) => {
  app[method.toLowerCase()](`/api${path}`, async (req, res) => {
    try {
      const headers = { ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {}) };
      if (!headers.Authorization && upstreamToken) headers.Authorization = upstreamToken;
      const upstream = await forward({
        path: path.replace(/^\//, ''),
        method,
        query: req.query,
        body: req.body,
        headers
      });
      res.status(upstream.status).json(upstream.data ?? {});
    } catch (error) {
      handleError(res, error);
    }
  });
};

// Orders
['/order', '/orderArchive', '/receivedDriver', '/finishedOrder', '/reportOrder', '/getOrderCustomer', '/getById'].forEach((p) =>
  proxyInferred('GET', p)
);
['/changeStatus2', '/changeStatus', '/changeRegion', '/changeRegionOrder', '/editOrder', '/changeStatusQR'].forEach((p) =>
  proxyInferred('PATCH', p)
);
proxyInferred('POST', '/createOrder');

// Delivery
[
  '/delivery',
  '/deliveryWithArchive',
  '/getDelivery_items_by_id',
  '/getDelivery_items',
  '/getDeliveryCustomer',
  '/checkDelivery',
  '/getChat',
  '/getDeliveryChart',
  '/getDeliveryTotal'
].forEach(
  (p) => proxyInferred('GET', p)
);
['/createDelivery', '/editDelivery', '/editReceivedMoney', '/editDesc', '/verify', '/uploadExcelFile', '/createChat'].forEach(
  (p) => proxyInferred('POST', p)
);

// Users / Branch / Driver / Roles / Region / Khoroo
[
  '/users',
  '/userById',
  '/driver',
  '/getBranch',
  '/branchById',
  '/branchIdUserId',
  '/roles',
  '/region',
  '/khoroo',
  '/globalSearch',
  '/wareByUserId'
].forEach((p) => proxyInferred('GET', p));
[
  '/createUser',
  '/createBranch',
  '/createDriver',
  '/editUser',
  '/editBranch',
  '/approve',
  '/approveBranch',
  '/changePassword',
  '/resetPassword',
  '/reset-password',
  '/changeDans',
  '/createRole',
  '/createRegion',
  '/createKhoroo'
].forEach(
  (p) => proxyInferred('POST', p)
);

// Delete helpers
['/delete', '/deleteOrder', '/deleteItem', '/deleteDelivery', '/deleteBranch', '/deleteUser', '/deleteWare'].forEach((p) =>
  proxyInferred('DELETE', p)
);

// Web help
['/getComic', '/getComment', '/getNotification', '/getByIdForPrint', '/getByIdForPrintDelivery', '/getPrintReportGeneralDriver', '/getReportDriverExcel', '/getReportCustomerExcel', '/getReportWareSelect'].forEach(
  (p) => proxyInferred('GET', p)
);
['/createComic', '/createComment', '/upload-image'].forEach((p) => proxyInferred('POST', p));

// Items / Ware / Reports (additional inferred)
[
  '/items',
  '/itemsById',
  '/itemsByWareId',
  '/getWareCustomer',
  '/getItemCustomer',
  '/getReportWareByUser',
  '/getReportGeneralCustomerByUser',
  '/reportCustomerByUser',
  '/getReportDashboard',
  '/getDeliveryChart',
  '/getDeliveryTotal',
  '/getReportCustomerMoney',
  '/getReportDriverMoney',
  '/getReportDriverMoneyDone',
  '/getReportGeneralCustomer',
  '/getReportGeneralDriver',
  '/getReportWare',
  '/getReportWareByUser',
  '/getReturnedItem',
  '/reportCustomer',
  '/reportDone',
  '/reportDoneCustomer',
  '/reportDriver',
  '/reportRestore',
  '/getGroupItem',
  '/getCustomerReportDetail'
].forEach((p) => proxyInferred('GET', p));
['/createItem', '/createWare', '/addItem', '/bundleItem', '/prepareItem', '/readyItem'].forEach((p) => proxyInferred('POST', p));
['/editItem', '/editItemQuantity', '/editPay', '/editCash', '/editStart', '/editEnd', '/editAccount', '/editWare'].forEach((p) =>
  proxyInferred('PATCH', p)
);

app.listen(PORT, () => {
  console.log(`Proxy listening on http://localhost:${PORT} (forwarding to ${PROVIDER_BASE})`);
});
