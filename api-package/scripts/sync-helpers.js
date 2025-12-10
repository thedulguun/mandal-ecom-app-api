#!/usr/bin/env node
/**
 * Sync generated helpers from /client/generated into api-package/src/helpers,
 * rewriting imports to point at this package's config/http.
 */
import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(process.cwd(), '..'); // assume script runs from api-package/
const srcHelpersDir = path.join(projectRoot, 'api-package', 'src', 'helpers');
const clientGeneratedDir = path.join(projectRoot, 'client', 'generated');

const files = [
  { src: 'from-captures.js', dest: 'from-captures.js' },
  { src: 'inferred.js', dest: 'inferred.js' }
];

const replaceImports = (text) =>
  text
    .replace(/'\.\.\/shared\/http\.js'/g, "'../http.js'")
    .replace(/'\.\.\/shared\/config\.js'/g, "'../config.js'");

if (!fs.existsSync(clientGeneratedDir)) {
  console.error('Missing client/generated directory. Run generation there first.');
  process.exit(1);
}

fs.mkdirSync(srcHelpersDir, { recursive: true });

files.forEach(({ src, dest }) => {
  const from = path.join(clientGeneratedDir, src);
  const to = path.join(srcHelpersDir, dest);
  if (!fs.existsSync(from)) {
    console.warn(`Skipping missing ${from}`);
    return;
  }
  const content = fs.readFileSync(from, 'utf8');
  fs.writeFileSync(to, replaceImports(content), 'utf8');
  console.log(`Synced ${src} -> ${to}`);
});

// Update helpers/index.js exports
const indexPath = path.join(srcHelpersDir, 'index.js');
const indexContent = [
  "// Auto-generated export barrel for helpers.",
  "export * from './from-captures.js';",
  "export * from './inferred.js';",
  ""
].join('\n');
fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('Updated helpers/index.js');
