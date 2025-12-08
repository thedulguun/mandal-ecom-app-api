// Thin fetch wrapper with URL building and normalized errors.
import { getBaseUrl, getDefaultHeaders } from './config.js';

export const buildUrl = (base, path, query) => {
  const root = (base || getBaseUrl() || '').replace(/\/$/, '');
  const cleanPath = (path || '').replace(/^\//, '');
  const url = new URL(`${root}/${cleanPath}`);
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

const buildError = (message, res, body) => {
  const err = new Error(message);
  err.status = res?.status;
  err.body = body;
  return err;
};

export const httpRequest = async ({
  path,
  method = 'GET',
  headers,
  query,
  body,
  baseUrl
}) => {
  const url = buildUrl(baseUrl, path, query);
  const finalHeaders = { ...getDefaultHeaders(), ...(headers || {}) };
  const opts = { method, headers: finalHeaders };
  if (body !== undefined && body !== null) {
    opts.body = typeof body === 'string' ? body : JSON.stringify(body);
  } else {
    // Avoid sending Content-Type when there is no body.
    delete opts.headers['Content-Type'];
  }
  const res = await fetch(url, opts);
  const parsed = await parseBody(res);
  if (!res.ok) {
    throw buildError(`Request failed (${res.status})`, res, parsed);
  }
  return { status: res.status, ok: res.ok, data: parsed, headers: res.headers };
};
