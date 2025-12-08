const fs = require('fs');
const path = require('path');

const capturesDir = path.join(process.cwd(), 'docs', 'captured-requests');
const outputDir = path.join(process.cwd(), 'client', 'generated');
const outputFile = path.join(outputDir, 'from-captures.js');

const allowedHeaders = new Set(['accept', 'content-type', 'authorization']);

const toCamel = (name) =>
  name
    .replace(/\.[^/.]+$/, '')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part, idx) =>
      idx === 0 ? part.toLowerCase() : part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    )
    .join('') || 'capture';

const parseBlocks = (content) => {
  const entries = [];
  const re =
    /(?:^|\n)\s*(request|response)\s*(\d*)\s*:\s*\n([\s\S]*?)(?=\n\s*(?:request|response)\s*\d*\s*:|$)/gi;
  let m;
  while ((m = re.exec(content)) !== null) {
    entries.push({
      type: m[1].toLowerCase(),
      index: m[2] ? Number(m[2]) : 1,
      body: (m[3] || '').trim()
    });
  }
  const requests = entries.filter((e) => e.type === 'request').sort((a, b) => a.index - b.index);
  const responses = entries.filter((e) => e.type === 'response').sort((a, b) => a.index - b.index);
  return requests.map((req, idx) => ({
    request: req.body,
    response: responses[idx] ? responses[idx].body : ''
  }));
};

const stripPath = (rawUrl) => {
  const url = new URL(rawUrl);
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments[0] === 'api') segments.shift();
  if (segments[0] && /^v\d+/i.test(segments[0])) segments.shift();
  const pathPart = segments.join('/');
  const query = Object.fromEntries(url.searchParams.entries());
  return { path: pathPart, query };
};

const parseHeaders = (reqText) => {
  const headers = {};
  let hasAuth = false;
  const re = /-H\s+["']([^:"']+)\s*:\s*([^"']*)["']/gi;
  let m;
  while ((m = re.exec(reqText)) !== null) {
    const key = m[1].trim();
    const val = m[2].trim();
    const lower = key.toLowerCase();
    if (!allowedHeaders.has(lower)) continue;
    if (lower === 'authorization') {
      hasAuth = true;
      continue;
    }
    headers[key] = val;
  }
  return { headers, hasAuth };
};

const parseBody = (reqText) => {
  const m =
    reqText.match(/--data-raw\s+'([^']*)'/is) ||
    reqText.match(/--data-raw\s+"([^"]*)"/is) ||
    reqText.match(/--data\s+'([^']*)'/is) ||
    reqText.match(/--data\s+"([^"]*)"/is);
  if (!m) return undefined;
  const raw = m[1];
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

const scrubSensitive = (val) => {
  if (val && typeof val === 'object' && !Array.isArray(val)) {
    const next = {};
    Object.entries(val).forEach(([k, v]) => {
      if (/password|token|email/i.test(k)) {
        next[k] = '';
      } else {
        next[k] = scrubSensitive(v);
      }
    });
    return next;
  }
  if (Array.isArray(val)) {
    return val.map((v) => scrubSensitive(v));
  }
  return val;
};

const detectMethod = (reqText, hasBody) => {
  const m = reqText.match(/-X\s+([A-Z]+)/i);
  if (m) return m[1].toUpperCase();
  if (hasBody) return 'POST';
  return 'GET';
};

const parseCurl = (reqText) => {
  const urlMatch = reqText.match(/curl\s+['"]([^'"]+)['"]/i);
  if (!urlMatch) return null;
  const url = urlMatch[1];
  const bodyRaw = parseBody(reqText);
  const body = scrubSensitive(bodyRaw);
  const { headers, hasAuth } = parseHeaders(reqText);
  const method = detectMethod(reqText, body !== undefined);
  const { path: pathPart, query } = stripPath(url);
  return { url, method, headers, hasAuth, body, path: pathPart, query };
};

const buildHeadersBlock = (headersObj, hasAuth) => {
  const baseHeaders = Object.keys(headersObj).length
    ? `const headers = ${JSON.stringify(headersObj, null, 2)};`
    : `const headers = {};`;
  const merge = hasAuth
    ? '{ ...headers, ...getAuthHeaders(), ...(options.headers || {}) }'
    : '{ ...headers, ...(options.headers || {}) }';
  return { baseHeaders, merge };
};

const buildFunction = (name, pairs) => {
  const usesAuth = pairs.some((p) => p.parsed && p.parsed.hasAuth);
  const lines = [];
  lines.push(`export async function ${name}(options = {}) {`);
  lines.push(`  const results = [];`);
  if (usesAuth) {
    lines.push(`  const authHeaders = getAuthHeaders();`);
  }
  pairs.forEach((pair, idx) => {
    const parsed = pair.parsed;
    if (!parsed) return;
    const { baseHeaders, merge } = buildHeadersBlock(parsed.headers, parsed.hasAuth);
    const hasQuery = Object.keys(parsed.query || {}).length > 0;
    const hasBody = parsed.body !== undefined;
    lines.push(`  {`);
    lines.push(`    // request ${idx + 1} from ${name}.md`);
    lines.push(`    ${baseHeaders}`);
    if (hasQuery) {
      lines.push(`    const query = { ...${JSON.stringify(parsed.query, null, 2)}, ...(options.query || {}) };`);
    }
    if (hasBody) {
      if (typeof parsed.body === 'string') {
        lines.push(
          `    const body = options.body === undefined ? ${JSON.stringify(parsed.body)} : options.body;`
        );
      } else {
        lines.push(
          `    const body = { ...${JSON.stringify(parsed.body, null, 2)}, ...(options.body || {}) };`
        );
      }
    }
    const opts = [];
    opts.push(`path: '${parsed.path || ''}'`);
    opts.push(`method: '${parsed.method}'`);
    if (hasQuery) opts.push(`query`);
    opts.push(`headers: ${merge.replace('getAuthHeaders()', usesAuth ? 'authHeaders' : 'getAuthHeaders()')}`);
    if (hasBody) opts.push(`body`);
    opts.push(`baseUrl: options.baseUrl`);
    lines.push(`    const res = await httpRequest({ ${opts.join(', ')} });`);
    lines.push(`    results.push({ status: res.status, data: res.data, ok: res.ok });`);
    lines.push(`  }`);
  });
  lines.push(`  return results.length === 1 ? results[0] : results;`);
  lines.push(`}`);
  return lines.join('\n');
};

const generate = () => {
  if (!fs.existsSync(capturesDir)) {
    console.error(`captures directory not found: ${capturesDir}`);
    process.exit(1);
  }
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const files = fs.readdirSync(capturesDir).filter((f) => f.endsWith('.md'));
  const functions = [];

  files.forEach((file) => {
    const content = fs.readFileSync(path.join(capturesDir, file), 'utf8');
    const pairs = parseBlocks(content).map((pair) => {
      const parsed = parseCurl(pair.request);
      return { ...pair, parsed };
    });
    const name = toCamel(file);
    const fn = buildFunction(name, pairs);
    functions.push(fn);
  });

  const usesAuth = functions.join('').includes('getAuthHeaders');
  const header = `// AUTO-GENERATED FROM docs/captured-requests by scripts/generate-client.js
// Do not edit manually. Run \`node scripts/generate-client.js\` after updating captures.

import { httpRequest } from '../shared/http.js';
${usesAuth ? "import { getAuthHeaders } from '../shared/config.js';\n" : ''}`;

  const body = functions.join('\n\n');
  fs.writeFileSync(outputFile, `${header}\n${body}\n`);
  console.log(`Generated ${outputFile} with ${functions.length} functions.`);
};

generate();
