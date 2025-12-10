import { buildUrl, getAuthHeaders } from './config.js';

const defaultHeaders = {
  Accept: 'application/json, text/plain, */*'
};

export async function httpRequest({ path, method = 'GET', query, body, headers = {} }) {
  const url = new URL(buildUrl(path));
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
    });
  }

  const finalHeaders = { ...defaultHeaders, ...getAuthHeaders(), ...headers };
  const options = { method, headers: finalHeaders };

  if (body !== undefined && body !== null && method !== 'GET' && method !== 'HEAD') {
    options.body = JSON.stringify(body);
    options.headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url.toString(), options);
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: res.status, ok: res.ok, data };
}
