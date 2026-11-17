import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { SERVICES, INDUSTRIES, SITE_TYPES, keysOf } from './src/taxonomy.js';

// ---- data/works.csv -> JS module, validated at build time ----
// Multi-value cells (siteType, skills) use "|" as separator, e.g. "PHP|Laravel|MySQL".
function parseCSV(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  text = text.replace(/^﻿/, ''); // Excel BOM
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') q = false;
      else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((c) => c.trim() !== '')) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim() !== '')) rows.push(row);
  return rows;
}

const list = (v) => (v || '').split('|').map((s) => s.trim()).filter(Boolean);
const bool = (v) => /^(1|true|yes|y|○|はい)$/i.test((v || '').trim());

function worksFromCSV(text, file) {
  const [head, ...body] = parseCSV(text);
  const cols = head.map((h) => h.trim());
  const valid = { service: keysOf(SERVICES), industry: keysOf(INDUSTRIES), siteType: keysOf(SITE_TYPES) };
  const errors = [], ids = new Set();
  const works = body.map((cells, n) => {
    const r = Object.fromEntries(cols.map((c, i) => [c, (cells[i] ?? '').trim()]));
    const line = n + 2;
    const w = {
      id: r.id, service: r.service, industry: r.industry,
      siteType: list(r.siteType), skills: list(r.skills),
      year: Number(r.year) || null, featured: bool(r.featured), sample: bool(r.sample),
      thumb: r.thumb || '', url: r.url || '', figma: r.figma || '',
      ja: { title: r.title_ja, summary: r.summary_ja, role: r.role_ja, result: r.result_ja },
      en: { title: r.title_en || r.title_ja, summary: r.summary_en || r.summary_ja, role: r.role_en || r.role_ja, result: r.result_en || r.result_ja },
    };
    if (!w.id) errors.push(`line ${line}: missing id`);
    else if (ids.has(w.id)) errors.push(`line ${line}: duplicate id "${w.id}"`);
    ids.add(w.id);
    if (!valid.service.includes(w.service)) errors.push(`line ${line}: service "${w.service}" must be one of ${valid.service.join(', ')}`);
    if (!valid.industry.includes(w.industry)) errors.push(`line ${line}: industry "${w.industry}" must be one of ${valid.industry.join(', ')}`);
    for (const s of w.siteType) if (!valid.siteType.includes(s)) errors.push(`line ${line}: siteType "${s}" must be one of ${valid.siteType.join(', ')}`);
    if (!w.ja.title) errors.push(`line ${line}: missing title_ja`);
    if (w.figma && !/^https:\/\/(www\.)?figma\.com\//.test(w.figma)) errors.push(`line ${line}: figma must be a https://www.figma.com/ link`);
    return w;
  });
  if (errors.length) throw new Error(`${file}\n  ` + errors.join('\n  '));
  return works;
}

const csvWorks = () => ({
  name: 'works-csv',
  transform(code, id) {
    if (!id.endsWith('.csv')) return null;
    return { code: `export default ${JSON.stringify(worksFromCSV(code, id))};`, map: null };
  },
});

// Relative base so the build works on GitHub Pages (/<repo>/) and any other host.
export default defineConfig({
  base: './',
  plugins: [csvWorks()],
  build: {
    rollupOptions: {
      input: { main: resolve(__dirname, 'index.html'), works: resolve(__dirname, 'works.html') },
    },
  },
});
