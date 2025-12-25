/* Simple Express proxy for ebuuhia API.
 * Stores the upstream token in memory and forwards requests from the browser.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
const { createRecorder } = require('./recording');

const PORT = process.env.PORT || 3000;
const PROVIDER_BASE =
  (process.env.EBUUHIA_BASE_URL || 'https://api.ebuuhia.mn/api/v1').replace(/\/$/, '');

let upstreamToken = '';

const app = express();
app.use(cors());
app.use(express.json());

const recorder = createRecorder({
  enabled: process.env.PROXY_RECORD,
  dir: process.env.PROXY_RECORD_DIR || path.join(__dirname, '..', 'docs', 'captured-requests', 'runtime')
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    const existing = req.headers['x-request-id'];
    const requestId = typeof existing === 'string' && existing.trim() ? existing.trim() : crypto.randomUUID();
    req.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);
  }
  next();
});

const buildUrl = (path, query) => {
  const cleanPath = (path || '').replace(/^\//, '');
  const url = new URL(`${PROVIDER_BASE}/${cleanPath}`);
  if (query) {
    Object.entries(query).forEach(([key, val]) => {
      if (val === undefined || val === null) return;
      if (Array.isArray(val)) {
        val.forEach((v) => {
          if (v === undefined || v === null) return;
          url.searchParams.append(key, String(v));
        });
        return;
      }
      url.searchParams.set(key, String(val));
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

const getAuthHeader = (req) => {
  const token = req.headers.authorization || upstreamToken || '';
  return token ? { Authorization: token } : {};
};

const logUpstream = (path, upstream) => {
  if (upstream?.ok) return;
  const snippet =
    typeof upstream?.data === 'string'
      ? upstream.data.slice(0, 200)
      : upstream?.data?.error || upstream?.data?.message || JSON.stringify(upstream?.data || {});
  console.warn(`[proxy] ${path} -> upstream status ${upstream?.status} ${snippet}`);
};

const isProbablyJsonRequest = (req) => {
  const ct = String(req.headers['content-type'] || '').toLowerCase();
  // If the client doesn't set it, treat it as JSON for our normal fetch-based callers.
  return ct === '' || ct.includes('application/json');
};

const isMissing = (val) => val === undefined || val === null || val === '';

const escapeSqlString = (val) => String(val).replace(/'/g, "''");

const sanitizeStringFields = (body) => {
  if (!body || typeof body !== 'object') return body;
  if (Array.isArray(body)) return body.map((item) => sanitizeStringFields(item));
  const out = {};
  Object.entries(body).forEach(([key, value]) => {
    if (typeof value === 'string') {
      out[key] = escapeSqlString(value);
      return;
    }
    if (Array.isArray(value)) {
      out[key] = value.map((item) => sanitizeStringFields(item));
      return;
    }
    out[key] = value;
  });
  return out;
};

const sanitizeDeliveryBody = (body) => {
  if (!body || typeof body !== 'object') return body;
  const safe = sanitizeStringFields(body);
  return safe;
};

const validateRequest = (req, res, { requiredQueryKeys = [], requiredBodyKeys = [], bodyRequired = false } = {}) => {
  for (const key of requiredQueryKeys) {
    if (isMissing(req.query?.[key])) {
      res.status(400).json({ error: `Missing required query param: ${key}` });
      return false;
    }
  }
  for (const key of requiredBodyKeys) {
    if (isMissing(req.body?.[key])) {
      res.status(400).json({ error: `Missing required body field: ${key}` });
      return false;
    }
  }
  if (bodyRequired && isProbablyJsonRequest(req)) {
    const body = req.body || {};
    if (typeof body !== 'object' || Array.isArray(body) || Object.keys(body).length === 0) {
      res.status(400).json({ error: 'Request body is required.' });
      return false;
    }
  }
  return true;
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
  return { status: res.status, ok: res.ok, data, url };
};

const handleError = (res, error) => {
  const message = error?.message || 'Proxy error';
  res.status(500).json({ error: message });
};

const recordEvent = (req, { routePath, upstream, durationMs, local = false }) => {
  if (!recorder.enabled) return;
  const startedAt = req.startedAt || null;
  recorder.record({
    requestId: req.requestId,
    proxy: {
      method: req.method,
      path: routePath || req.path,
      originalUrl: req.originalUrl,
      query: req.query,
      headers: recorder.sanitizeHeaders(req.headers),
      body: req.body
    },
    upstream: upstream
      ? {
          url: upstream.url,
          method: req.method,
          status: upstream.status,
          ok: upstream.ok,
          data: upstream.data
        }
      : null,
    local,
    durationMs,
    startedAt
  });
};

app.get('/api/health', (req, res) => {
  req.startedAt = new Date().toISOString();
  recordEvent(req, { routePath: '/api/health', upstream: null, durationMs: 0, local: true });
  res.json({ ok: true });
});

app.post('/api/login', async (req, res) => {
  req.startedAt = new Date().toISOString();
  const started = Date.now();
  try {
    if (!req.body?.email || !req.body?.password) {
      res.status(400).json({ error: 'email and password are required.' });
      return;
    }
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
    recordEvent(req, { routePath: '/api/login', upstream, durationMs: Date.now() - started });
    res.status(upstream.status).json(upstream.data ?? {});
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/deliveries', async (req, res) => {
  req.startedAt = new Date().toISOString();
  const started = Date.now();
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
    recordEvent(req, { routePath: '/api/deliveries', upstream, durationMs: Date.now() - started });
    res.status(upstream.status).json(upstream.data ?? {});
  } catch (error) {
    handleError(res, error);
  }
});

app.post('/api/logout', async (_req, res) => {
  const req = _req;
  req.startedAt = new Date().toISOString();
  const started = Date.now();
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
    recordEvent(req, { routePath: '/api/logout', upstream: { status: 200, ok: true, data: { results }, url: null }, durationMs: Date.now() - started, local: true });
    res.json({ results });
  } catch (error) {
    handleError(res, error);
  }
});

// Proxy inferred endpoints: simple pass-through; token can be provided or uses cached upstreamToken.
const proxyInferred = (method, path, opts = {}) => {
  const requireAuth = opts.requireAuth !== false;
  const validate = opts.validate || {};
  const transformBody = opts.transformBody;
  app[method.toLowerCase()](`/api${path}`, async (req, res) => {
    req.startedAt = new Date().toISOString();
    const started = Date.now();
    try {
      const headers = { ...getAuthHeader(req) };
      if (requireAuth && !headers.Authorization) {
        res.status(401).json({ error: 'Login first to obtain a token.' });
        return;
      }
      const needsBodyValidation = method === 'POST' || method === 'PATCH' || method === 'PUT';
      if (
        !validateRequest(req, res, {
          ...validate,
          bodyRequired: validate.bodyRequired ?? needsBodyValidation
        })
      ) {
        return;
      }
      const upstream = await forward({
        path: path.replace(/^\//, ''),
        method,
        query: req.query,
        body: transformBody ? transformBody(req.body) : req.body,
        headers
      });
      logUpstream(path, upstream);
      recordEvent(req, { routePath: `/api${path}`, upstream, durationMs: Date.now() - started });
      res.status(upstream.status).json(upstream.data ?? {});
    } catch (error) {
      handleError(res, error);
    }
  });
};

// Delivery creation with minimal validation and auth guard
app.post('/api/createDelivery', async (req, res) => {
  req.startedAt = new Date().toISOString();
  const started = Date.now();
  try {
    const safeBody = sanitizeDeliveryBody(req.body);
    const headers = { ...getAuthHeader(req) };
    if (!headers.Authorization) {
      res.status(401).json({ error: 'Login first to obtain a token.' });
      return;
    }
    const { user_id, cus_name, cus_phone, items, item_name, quantity } = safeBody || {};
    const hasItems = Array.isArray(items) && items.length > 0;
    const hasManualItem = item_name && quantity !== undefined && quantity !== null && quantity !== '';
    if (!user_id || !cus_name || !cus_phone) {
      res.status(400).json({ error: 'user_id, cus_name, and cus_phone are required.' });
      return;
    }
    if (!hasItems && !hasManualItem) {
      res
        .status(400)
        .json({ error: 'Provide either an items array [{id, start}] or manual item_name + quantity.' });
      return;
    }
    const upstream = await forward({
      path: 'createDelivery',
      method: 'POST',
      body: safeBody,
      headers
    });
    logUpstream('createDelivery', upstream);
    recordEvent(req, { routePath: '/api/createDelivery', upstream, durationMs: Date.now() - started });
    res.status(upstream.status).json(upstream.data ?? {});
  } catch (error) {
    handleError(res, error);
  }
});

// Orders
['/order', '/orderArchive', '/receivedDriver', '/finishedOrder', '/reportOrder'].forEach((p) => proxyInferred('GET', p));
proxyInferred('GET', '/getOrderCustomer', { validate: { requiredQueryKeys: ['id'], bodyRequired: false } });
proxyInferred('GET', '/getById', { validate: { requiredQueryKeys: ['id', 'table'], bodyRequired: false } });
['/changeStatus2', '/changeStatus', '/changeRegion', '/changeRegionOrder', '/editOrder', '/changeStatusQR'].forEach((p) =>
  proxyInferred('PATCH', p)
);
proxyInferred('POST', '/createOrder');
// Some clients call this as POST; allow both until confirmed.
proxyInferred('POST', '/changeStatusQR', { validate: { bodyRequired: false } });

// Delivery
['/delivery', '/deliveryWithArchive', '/getDelivery_items', '/checkDelivery'].forEach((p) => proxyInferred('GET', p));
proxyInferred('GET', '/getDelivery_items_by_id', { validate: { requiredQueryKeys: ['id'], bodyRequired: false } });
proxyInferred('GET', '/getDeliveryCustomer', { validate: { requiredQueryKeys: ['id'], bodyRequired: false } });
proxyInferred('GET', '/getChat', { validate: { requiredQueryKeys: ['delivery_id', 'user_id'], bodyRequired: false } });
proxyInferred('GET', '/getDeliveryChart', { validate: { requiredQueryKeys: ['user_id'], bodyRequired: false } });
proxyInferred('GET', '/getDeliveryTotal', { validate: { requiredQueryKeys: ['table', 'id'], bodyRequired: false } });
proxyInferred('PATCH', '/editDelivery', {
  transformBody: sanitizeDeliveryBody,
  validate: { requiredBodyKeys: ['id'] }
});
proxyInferred('PATCH', '/editDesc', { transformBody: sanitizeDeliveryBody });
['/editReceivedMoney', '/verify'].forEach((p) => proxyInferred('PATCH', p));
proxyInferred('POST', '/createChat', { validate: { requiredBodyKeys: ['user_id', 'delivery_id', 'comment'] } });
proxyInferred('POST', '/uploadExcelFile', { validate: { bodyRequired: false } });

// Users / Branch / Driver / Roles / Region / Khoroo
[
  '/users',
  '/driver',
  '/getBranch',
  '/roles',
  '/region',
  '/khoroo',
  '/globalSearch'
].forEach((p) => proxyInferred('GET', p));
proxyInferred('GET', '/userById', { validate: { requiredQueryKeys: ['user_id'], bodyRequired: false } });
proxyInferred('GET', '/branchById', { validate: { requiredQueryKeys: ['branch_id'], bodyRequired: false } });
proxyInferred('GET', '/branchIdUserId', { validate: { requiredQueryKeys: ['user_id'], bodyRequired: false } });
proxyInferred('GET', '/wareByUserId', { validate: { requiredQueryKeys: ['user_id'], bodyRequired: false } });
[
  '/createUser',
  '/createBranch',
  '/createDriver',
  '/resetPassword',
  '/reset-password',
  '/createRole',
  '/createRegion',
  '/createKhoroo'
].forEach(
  (p) => proxyInferred('POST', p)
);
['/editBranch', '/approve', '/approveBranch', '/changePassword', '/changeDans'].forEach((p) => proxyInferred('PATCH', p));
proxyInferred('PATCH', '/editUser', { validate: { requiredBodyKeys: ['id'] } });

// Delete helpers
proxyInferred('DELETE', '/delete', { validate: { requiredQueryKeys: ['table', 'id'] } });
['/deleteOrder', '/deleteItem', '/deleteDelivery', '/deleteBranch', '/deleteUser', '/deleteWare'].forEach((p) =>
  proxyInferred('DELETE', p, { validate: { requiredQueryKeys: ['id'] } })
);

// Web help
proxyInferred('GET', '/getComic', { requireAuth: false });
proxyInferred('GET', '/getComment', { requireAuth: false });
proxyInferred('GET', '/getNotification', { validate: { requiredQueryKeys: ['user_id'], bodyRequired: false } });
['/getByIdForPrint', '/getByIdForPrintDelivery', '/getPrintReportGeneralDriver', '/getReportDriverExcel', '/getReportCustomerExcel', '/getReportWareSelect'].forEach(
  (p) => proxyInferred('GET', p)
);
['/createComic', '/createComment'].forEach((p) => proxyInferred('POST', p));
proxyInferred('POST', '/upload-image', { validate: { bodyRequired: false } });

// Items / Ware / Reports (additional inferred)
[
  '/items',
  '/getReportCustomerMoney',
  '/getReportDriverMoney',
  '/getReportDriverMoneyDone',
  '/getReportGeneralCustomer',
  '/getReportGeneralDriver',
  '/getReportWare',
  '/getReturnedItem',
  '/prepareItem',
  '/readyItem',
  '/reportCustomer',
  '/reportDone',
  '/reportDoneCustomer',
  '/reportDriver',
  '/reportRestore',
  '/getGroupItem',
  '/getCustomerReportDetail'
].forEach((p) => proxyInferred('GET', p));
proxyInferred('GET', '/itemsById', { validate: { requiredQueryKeys: ['id'], bodyRequired: false } });
proxyInferred('GET', '/getWareCustomer', { validate: { requiredQueryKeys: ['id'], bodyRequired: false } });
proxyInferred('GET', '/getReportWareByUser', { validate: { requiredQueryKeys: ['id'], bodyRequired: false } });
proxyInferred('GET', '/getReportGeneralCustomerByUser', { validate: { requiredQueryKeys: ['id'], bodyRequired: false } });
proxyInferred('GET', '/reportCustomerByUser', { validate: { requiredQueryKeys: ['id'], bodyRequired: false } });
proxyInferred('GET', '/getReportDashboard', { validate: { requiredQueryKeys: ['user_id'], bodyRequired: false } });
proxyInferred('GET', '/itemsByWareId', { validate: { requiredQueryKeys: ['ware_id'], bodyRequired: false } });
proxyInferred('GET', '/getItemCustomer', { validate: { requiredQueryKeys: ['id'], bodyRequired: false } });
proxyInferred('POST', '/createItem', { validate: { requiredBodyKeys: ['name', 'price', 'staff', 'user_id', 'ware_id'] } });
['/createWare', '/addItem', '/bundleItem', '/prepareItem', '/readyItem'].forEach((p) => proxyInferred('POST', p));
['/editItem', '/editItemQuantity', '/editPay', '/editCash', '/editStart', '/editEnd', '/editAccount', '/editWare'].forEach((p) =>
  proxyInferred('PATCH', p)
);

app.listen(PORT, () => {
  console.log(`Proxy listening on http://localhost:${PORT} (forwarding to ${PROVIDER_BASE})`);
});
