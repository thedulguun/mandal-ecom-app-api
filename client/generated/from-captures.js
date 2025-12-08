// AUTO-GENERATED FROM docs/captured-requests by scripts/generate-client.js
// Do not edit manually. Run `node scripts/generate-client.js` after updating captures.

import { httpRequest } from '../shared/http.js';
import { getAuthHeaders } from '../shared/config.js';

export async function getDeliveryList(options = {}) {
  const results = [];
  const authHeaders = getAuthHeaders();
  {
    // request 1 from getDeliveryList.md
    const headers = {
  "Accept": "application/json, text/plain, */*"
};
    const query = { ...{
  "startLimit": "0",
  "endLimit": "100",
  "order": "",
  "sort": "asc",
  "search": "",
  "value": "",
  "status": "100",
  "id": "2015",
  "action": "0"
}, ...(options.query || {}) };
    const res = await httpRequest({ path: 'getDeliveryCustomer', method: 'GET', query, headers: { ...headers, ...authHeaders, ...(options.headers || {}) }, baseUrl: options.baseUrl });
    results.push({ status: res.status, data: res.data, ok: res.ok });
  }
  return results.length === 1 ? results[0] : results;
}

export async function login(options = {}) {
  const results = [];
  {
    // request 1 from login.md
    const headers = {
  "Accept": "application/json, text/plain, */*",
  "Content-Type": "application/json"
};
    const body = { ...{
  "email": "",
  "password": "",
  "device_token": ""
}, ...(options.body || {}) };
    const res = await httpRequest({ path: 'login', method: 'POST', headers: { ...headers, ...(options.headers || {}) }, body, baseUrl: options.baseUrl });
    results.push({ status: res.status, data: res.data, ok: res.ok });
  }
  return results.length === 1 ? results[0] : results;
}

export async function logout(options = {}) {
  const results = [];
  {
    // request 1 from logout.md
    const headers = {
  "Accept": "application/json, text/plain, */*"
};
    const res = await httpRequest({ path: 'getComment', method: 'GET', headers: { ...headers, ...(options.headers || {}) }, baseUrl: options.baseUrl });
    results.push({ status: res.status, data: res.data, ok: res.ok });
  }
  {
    // request 2 from logout.md
    const headers = {
  "Accept": "application/json, text/plain, */*"
};
    const res = await httpRequest({ path: 'getComic', method: 'GET', headers: { ...headers, ...(options.headers || {}) }, baseUrl: options.baseUrl });
    results.push({ status: res.status, data: res.data, ok: res.ok });
  }
  return results.length === 1 ? results[0] : results;
}
