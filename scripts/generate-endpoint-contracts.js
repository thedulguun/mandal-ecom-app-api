#!/usr/bin/env node
/**
 * Build an evidence-based contract map from runtime proxy captures.
 *
 * Usage:
 *   node scripts/generate-endpoint-contracts.js [inputDir] [outputJson] [outputMd]
 */
const fs = require('fs');
const path = require('path');

const DEFAULT_INPUT = path.join(__dirname, '..', 'docs', 'captured-requests', 'runtime');
const DEFAULT_JSON = path.join(__dirname, '..', 'docs', 'endpoint-contract.json');
const DEFAULT_MD = path.join(__dirname, '..', 'docs', 'endpoint-contract-summary.md');

const inputDir = process.argv[2] || DEFAULT_INPUT;
const outputJson = process.argv[3] || DEFAULT_JSON;
const outputMd = process.argv[4] || DEFAULT_MD;

const isPlainObject = (val) => val && typeof val === 'object' && !Array.isArray(val);
const isMissing = (val) => val === undefined || val === null || val === '';

const getBodyKeys = (body) => {
  if (body === null || body === undefined) return { keys: [], type: 'null' };
  if (Array.isArray(body)) return { keys: [], type: 'array' };
  if (typeof body === 'string') return { keys: [], type: 'string' };
  if (isPlainObject(body)) return { keys: Object.keys(body), type: 'object' };
  return { keys: [], type: typeof body };
};

const ensureMethod = (endpoint, method) => {
  if (!endpoint.methods[method]) {
    endpoint.methods[method] = {
      count: 0,
      queryKeys: new Set(),
      queryKeyStats: {},
      bodyKeys: new Set(),
      bodyKeyStats: {},
      bodyTypes: new Set(),
      authSeen: false,
      statuses: {},
      samples: [],
      errorSamples: []
    };
  }
  return endpoint.methods[method];
};

const readCaptures = (dir) => {
  if (!fs.existsSync(dir)) {
    console.error(`Missing capture directory: ${dir}`);
    process.exit(1);
  }
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => path.join(dir, f));
};

const main = () => {
  const files = readCaptures(inputDir);
  const endpoints = {};
  const statusTotals = {};
  const errors = [];

  files.forEach((filePath) => {
    const raw = fs.readFileSync(filePath, 'utf8');
    let data;
    try {
      data = JSON.parse(raw);
    } catch (err) {
      errors.push({ file: filePath, error: `Invalid JSON: ${err.message}` });
      return;
    }
    const proxy = data.proxy || {};
    const upstream = data.upstream || null;
    const method = String(proxy.method || '').toUpperCase();
    const routePath = proxy.path || '';
    if (!method || !routePath) return;

    const endpoint =
      endpoints[routePath] ||
      (endpoints[routePath] = {
        path: routePath,
        methods: {}
      });
    const methodEntry = ensureMethod(endpoint, method);
    methodEntry.count += 1;
    const query = proxy.query || {};
    Object.entries(query).forEach(([key, value]) => {
      methodEntry.queryKeys.add(key);
      const stats = methodEntry.queryKeyStats[key] || { present: 0, missing: 0 };
      stats.present += 1;
      if (isMissing(value)) stats.missing += 1;
      methodEntry.queryKeyStats[key] = stats;
    });

    const bodyInfo = getBodyKeys(proxy.body);
    bodyInfo.keys.forEach((key) => methodEntry.bodyKeys.add(key));
    methodEntry.bodyTypes.add(bodyInfo.type);
    if (isPlainObject(proxy.body)) {
      Object.entries(proxy.body).forEach(([key, value]) => {
        const stats = methodEntry.bodyKeyStats[key] || { present: 0, missing: 0 };
        stats.present += 1;
        if (isMissing(value)) stats.missing += 1;
        methodEntry.bodyKeyStats[key] = stats;
      });
    }

    if (proxy.headers && proxy.headers.authorization) {
      methodEntry.authSeen = true;
    }

    const status = upstream ? upstream.status : 'local';
    const statusKey = String(status);
    methodEntry.statuses[statusKey] = (methodEntry.statuses[statusKey] || 0) + 1;
    statusTotals[statusKey] = (statusTotals[statusKey] || 0) + 1;

    const relFile = path.relative(path.join(__dirname, '..'), filePath);
    if (methodEntry.samples.length < 5) methodEntry.samples.push(relFile);
    if (upstream && upstream.status >= 400 && methodEntry.errorSamples.length < 5) {
      methodEntry.errorSamples.push(relFile);
    }
  });

  const endpointList = Object.values(endpoints).map((entry) => {
    const methods = {};
    Object.entries(entry.methods).forEach(([method, m]) => {
      const requiredQueryKeys = Object.entries(m.queryKeyStats)
        .filter(([, stats]) => stats.present === m.count && stats.missing === 0)
        .map(([key]) => key)
        .sort();
      const requiredBodyKeys = Object.entries(m.bodyKeyStats)
        .filter(([, stats]) => stats.present === m.count && stats.missing === 0)
        .map(([key]) => key)
        .sort();
      methods[method] = {
        count: m.count,
        queryKeys: Array.from(m.queryKeys).sort(),
        requiredQueryKeys,
        bodyKeys: Array.from(m.bodyKeys).sort(),
        requiredBodyKeys,
        bodyTypes: Array.from(m.bodyTypes).sort(),
        authSeen: m.authSeen,
        statuses: m.statuses,
        samples: m.samples,
        errorSamples: m.errorSamples
      };
    });
    return { path: entry.path, methods };
  });

  endpointList.sort((a, b) => a.path.localeCompare(b.path));

  const output = {
    generatedAt: new Date().toISOString(),
    sourceDir: path.relative(path.join(__dirname, '..'), inputDir),
    totalCaptures: files.length,
    statusTotals,
    endpoints: endpointList,
    parseErrors: errors
  };

  fs.writeFileSync(outputJson, JSON.stringify(output, null, 2), 'utf8');

  const lines = [];
  lines.push('# Endpoint Contract Summary');
  lines.push('');
  lines.push(`Generated: ${output.generatedAt}`);
  lines.push(`Source: ${output.sourceDir}`);
  lines.push(`Total captures: ${output.totalCaptures}`);
  lines.push('');
  lines.push('## Status totals');
  Object.entries(statusTotals)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .forEach(([status, count]) => {
      lines.push(`- ${status}: ${count}`);
    });
  lines.push('');
  lines.push('## Endpoints (observed)');
  endpointList.forEach((ep) => {
    lines.push(`- ${ep.path}`);
    Object.entries(ep.methods).forEach(([method, info]) => {
      lines.push(`  - ${method}: ${info.count} captures`);
      if (info.queryKeys.length) lines.push(`    - query: ${info.queryKeys.join(', ')}`);
      if (info.bodyKeys.length) lines.push(`    - body: ${info.bodyKeys.join(', ')}`);
      if (info.bodyTypes.length) lines.push(`    - body types: ${info.bodyTypes.join(', ')}`);
      lines.push(`    - auth seen: ${info.authSeen ? 'yes' : 'no'}`);
      lines.push(`    - statuses: ${Object.entries(info.statuses).map(([s, c]) => `${s}(${c})`).join(', ')}`);
      if (info.samples.length) lines.push(`    - samples: ${info.samples.join(', ')}`);
      if (info.errorSamples.length) lines.push(`    - error samples: ${info.errorSamples.join(', ')}`);
    });
  });
  if (errors.length) {
    lines.push('');
    lines.push('## Parse errors');
    errors.forEach((err) => lines.push(`- ${err.file}: ${err.error}`));
  }
  fs.writeFileSync(outputMd, lines.join('\n') + '\n', 'utf8');

  console.log(`Wrote ${outputJson}`);
  console.log(`Wrote ${outputMd}`);
};

main();
