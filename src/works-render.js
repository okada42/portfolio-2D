// Shared rendering for project cards (homepage featured + Works page).
import WORKS from '../data/works.csv';
import { SERVICES, INDUSTRIES, SITE_TYPES } from './taxonomy.js';
import { getLang, t } from './i18n.js';

export { WORKS };

const byKey = (list) => Object.fromEntries(list.map((x) => [x.key, x]));
export const SERVICE = byKey(SERVICES), INDUSTRY = byKey(INDUSTRIES), SITE_TYPE = byKey(SITE_TYPES);
export const label = (item) => (item ? item[getLang()] ?? item.ja : '');
export const text = (w) => w[getLang()] ?? w.ja;

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const ICONS = {
  web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/></svg>',
  system: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/></svg>',
  game: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9h12a4 4 0 0 1 3.9 4.9l-.6 2.6A2.5 2.5 0 0 1 17 18l-2-2H9l-2 2a2.5 2.5 0 0 1-4.3-1.5l-.6-2.6A4 4 0 0 1 6 9z"/><path d="M8 11.5v3M6.5 13h3M15.5 12.5h.01M17.5 14h.01"/></svg>',
  mobile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="7" y="2.5" width="10" height="19" rx="2.2"/><path d="M11 18.5h2"/></svg>',
};

// stable hue per project for the placeholder thumbnail
const hue = (id) => { let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };

export function thumbHTML(w, big = false) {
  const svc = SERVICE[w.service];
  const badge = w.sample ? `<span class="w-sample">${esc(t('wf.sample'))}</span>` : '';
  if (w.thumb) {
    return `<div class="w-thumb${big ? ' big' : ''}"><img src="${esc(w.thumb)}" alt="" loading="lazy" decoding="async" />${badge}</div>`;
  }
  return `<div class="w-thumb ph${big ? ' big' : ''}" style="--h:${hue(w.id)}"><span class="w-ph-icon">${ICONS[svc.icon]}</span>${badge}</div>`;
}

// href: how the card links (on the Works page "?p=id", elsewhere "works.html?p=id")
export function cardHTML(w, href) {
  const x = text(w);
  const tags = w.skills.slice(0, 4).map((s) => `<li>${esc(s)}</li>`).join('') + (w.skills.length > 4 ? `<li>+${w.skills.length - 4}</li>` : '');
  return `<a class="w-card" href="${esc(href)}" data-id="${esc(w.id)}">
  ${thumbHTML(w)}
  <div class="w-body">
    <p class="w-meta"><span class="w-svc">${esc(label(SERVICE[w.service]))}</span><span>${esc(label(INDUSTRY[w.industry]))}</span></p>
    <h3>${esc(x.title)}</h3>
    <p class="w-sum">${esc(x.summary)}</p>
    <ul class="w-tags">${tags}</ul>
  </div>
</a>`;
}
