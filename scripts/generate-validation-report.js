#!/usr/bin/env node
/**
 * Generate a proxy validation report from endpoint-contract.json.
 *
 * Usage:
 *   node scripts/generate-validation-report.js [contractJson] [outputMd]
 */
const fs = require('fs');
const path = require('path');

const DEFAULT_CONTRACT = path.join(__dirname, '..', 'docs', 'endpoint-contract.json');
const DEFAULT_MD = path.join(__dirname, '..', 'docs', 'validation-report.md');

const inputJson = process.argv[2] || DEFAULT_CONTRACT;
const outputMd = process.argv[3] || DEFAULT_MD;

const formatList = (items) => (items && items.length ? items.join(', ') : 'none');

const main = () => {
  if (!fs.existsSync(inputJson)) {
    console.error(`Missing contract file: ${inputJson}`);
    process.exit(1);
  }
  const contract = JSON.parse(fs.readFileSync(inputJson, 'utf8'));
  const endpoints = Array.isArray(contract.endpoints) ? contract.endpoints : [];

  const lines = [];
  lines.push('# Validation Report (Proxy)');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Contract: ${path.relative(path.join(__dirname, '..'), inputJson)}`);
  if (contract.generatedAt) lines.push(`Contract generated: ${contract.generatedAt}`);
  if (contract.sourceDir) lines.push(`Source: ${contract.sourceDir}`);
  lines.push('');
  lines.push(
    'Rule: required keys are those present in every capture for a method and non-empty. Missing endpoints are not listed.'
  );
  lines.push('');
  lines.push('## Enforced fields (observed)');

  const omitted = [];
  endpoints.forEach((endpoint) => {
    const methodLines = [];
    Object.entries(endpoint.methods || {}).forEach(([method, info]) => {
      const requiredQuery = info.requiredQueryKeys || [];
      const requiredBody = info.requiredBodyKeys || [];
      if (!requiredQuery.length && !requiredBody.length) return;
      const parts = [];
      if (requiredQuery.length) parts.push(`query: ${formatList(requiredQuery)}`);
      if (requiredBody.length) parts.push(`body: ${formatList(requiredBody)}`);
      methodLines.push(`  - ${method}: ${parts.join(' | ')}`);
    });
    if (methodLines.length) {
      lines.push(`- ${endpoint.path}`);
      lines.push(...methodLines);
    } else {
      omitted.push(endpoint.path);
    }
  });

  lines.push('');
  lines.push(`## Omitted endpoints (${omitted.length})`);
  lines.push('No required fields observed in runtime captures for these endpoints.');
  if (omitted.length) {
    omitted.sort().forEach((pathItem) => lines.push(`- ${pathItem}`));
  }

  fs.writeFileSync(outputMd, lines.join('\n') + '\n', 'utf8');
  console.log(`Wrote ${outputMd}`);
};

main();
