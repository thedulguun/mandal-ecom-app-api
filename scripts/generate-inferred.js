const fs = require('fs');
const path = require('path');

const inferredPath = path.join(process.cwd(), 'scripts', 'inferred-endpoints.json');
const outputDir = path.join(process.cwd(), 'client', 'generated');
const outputFile = path.join(outputDir, 'inferred.js');

const load = () => JSON.parse(fs.readFileSync(inferredPath, 'utf8'));
const toFnName = (name) => name.replace(/[^A-Za-z0-9_$]/g, '');

const buildFunction = (ep) => {
  const fn = toFnName(ep.name);
  const cleanPath = ep.path.startsWith('/') ? ep.path.slice(1) : ep.path;
  const opts = [];
  opts.push(`path: '${cleanPath}'`);
  opts.push(`method: '${ep.method.toUpperCase()}'`);
  opts.push(`baseUrl: options.baseUrl`);
  if (ep.query) opts.push(`query: options.query`);
  if (ep.body) opts.push(`body: options.body`);
  opts.push(`headers: { ...(options.headers || {}), ...(options.useAuth === false ? {} : getAuthHeaders()) }`);
  return `
export async function ${fn}(options = {}) {
  const res = await httpRequest({ ${opts.join(', ')} });
  return res;
}
`;
};

const run = () => {
  const cfg = load();
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const functions = cfg.endpoints.map((ep) => buildFunction(ep)).join('\n');
  const header = `// AUTO-GENERATED from scripts/inferred-endpoints.json
// Do not edit manually.

import { httpRequest } from '../shared/http.js';
import { getAuthHeaders } from '../shared/config.js';
`;
  fs.writeFileSync(outputFile, `${header}\n${functions}\n`);
  console.log(`Generated ${outputFile} with ${cfg.endpoints.length} endpoints.`);
};

run();
