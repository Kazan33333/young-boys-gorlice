/**
 * Compile source HTML templates to fully static, GitHub Pages-ready HTML.
 * No runtime HTML fetching or template libraries are required.
 *
 * Edit src/pages/*.html or src/partials/*.html, then run `npm run build`.
 * Commit both the source templates and generated root HTML pages.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index', 'history', 'gallery', 'fixtures', 'results', 'tournaments', 'stats'];
const partials = new Map();
const source = async (path) => readFile(join(root, path), 'utf8');

for (const name of ['header', 'footer', 'search-modal', 'results-modal', 'base-head', 'libraries', 'analytics']) {
  partials.set(name, (await source(`src/partials/${name}.html`)).trimEnd());
}

for (const page of pages) {
  const values = {
    footerStyle: ['index', 'stats'].includes(page)
      ? 'padding: 5px !important;'
      : 'padding: 5px !important; width: 100%; position: fixed; bottom: 0; width: 100%; z-index: 1000;',
    modalSeason: page === 'tournaments' ? '2024/25' : '2025/26',
    modalTableClass: page === 'tournaments'
      ? 'table table-hover table-dark table-striped'
      : 'table table-sm table-hover table-dark table-striped',
  };
  let html = await source(`src/pages/${page}.html`);
  html = html.replace(/\{\{>([\w-]+)\}\}/g, (_, name) => {
    if (!partials.has(name)) throw new Error(`Unknown partial: ${name} (page ${page})`);
    return partials.get(name);
  });
  html = html.replace(/\{\{(\w+)\}\}/g, (_, name) => {
    if (!(name in values)) throw new Error(`Unknown variable: ${name} (page ${page})`);
    return values[name];
  });
  if (/\{\{.*?\}\}/.test(html)) throw new Error(`Unresolved template in ${page}.html`);
  await writeFile(join(root, `${page}.html`), html, 'utf8');
  process.stdout.write(`Built ${page}.html\n`);
}
