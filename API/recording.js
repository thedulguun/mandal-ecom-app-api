const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const toBoolean = (val) => {
  const v = String(val || '').toLowerCase().trim();
  return v === '1' || v === 'true' || v === 'yes' || v === 'on';
};

const isPlainObject = (val) => val && typeof val === 'object' && !Array.isArray(val);

const REDACT_KEYS = [
  'authorization',
  'cookie',
  'set-cookie',
  'password',
  'token',
  'device_token',
  'refresh_token',
  'access_token'
];

const shouldRedactKey = (key) => {
  const k = String(key || '').toLowerCase();
  return REDACT_KEYS.includes(k) || k.includes('password') || k.includes('token') || k.includes('authorization');
};

const redactValue = (val) => {
  if (val === undefined) return val;
  if (val === null) return val;
  return '[REDACTED]';
};

const sanitize = (input, { maxString = 20000 } = {}) => {
  if (input === null || input === undefined) return input;
  if (typeof input === 'string') return input.length > maxString ? `${input.slice(0, maxString)}…(truncated)` : input;
  if (typeof input === 'number' || typeof input === 'boolean') return input;
  if (Array.isArray(input)) return input.map((v) => sanitize(v, { maxString }));
  if (isPlainObject(input)) {
    const out = {};
    for (const [k, v] of Object.entries(input)) {
      out[k] = shouldRedactKey(k) ? redactValue(v) : sanitize(v, { maxString });
    }
    return out;
  }
  return String(input);
};

const sanitizeHeaders = (headers) => {
  const input = headers || {};
  const out = {};
  for (const [k, v] of Object.entries(input)) {
    out[k] = shouldRedactKey(k) ? redactValue(v) : v;
  }
  return out;
};

const safeFilenamePart = (str) =>
  String(str || '')
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 120);

function createRecorder(options = {}) {
  const enabled = toBoolean(options.enabled ?? process.env.PROXY_RECORD);
  const dir =
    options.dir ||
    process.env.PROXY_RECORD_DIR ||
    path.join(__dirname, '..', 'docs', 'captured-requests', 'runtime');

  if (enabled) fs.mkdirSync(dir, { recursive: true });

  const record = (event) => {
    if (!enabled) return null;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const id = event.requestId || crypto.randomUUID();
    const method = safeFilenamePart(event?.proxy?.method || '');
    const route = safeFilenamePart(event?.proxy?.path || '');
    const filename = `${timestamp}_${id}_${method}_${route}.json`;
    const filepath = path.join(dir, filename);

    const payload = sanitize(
      {
        recordedAt: new Date().toISOString(),
        requestId: id,
        ...event
      },
      { maxString: 20000 }
    );

    try {
      fs.writeFileSync(filepath, JSON.stringify(payload, null, 2), 'utf8');
      return filepath;
    } catch (err) {
      console.warn('[proxy][record] failed to write capture:', err?.message || err);
      return null;
    }
  };

  return { enabled, dir, record, sanitize, sanitizeHeaders };
}

module.exports = { createRecorder, sanitize, sanitizeHeaders };

