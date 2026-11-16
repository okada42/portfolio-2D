import { initCommon } from './common.js';
import { t, onLangChange } from './i18n.js';
import { SERVICES, INDUSTRIES, SITE_TYPES, SKILL_GROUPS, SEARCH_SYNONYMS } from './taxonomy.js';
import { WORKS, SERVICE, INDUSTRY, SITE_TYPE, label, text, esc, cardHTML, thumbHTML } from './works-render.js';

initCommon();

const $ = (s) => document.querySelector(s);
const els = {
  service: $('#f-service'), industry: $('#f-industry'), q: $('#f-q'), sort: $('#f-sort'),
  site: $('#d-site'), skill: $('#d-skill'), count: $('#f-count'), clear: $('#f-clear'),
  active: $('#f-active'), grid: $('#w-grid'), empty: $('#w-empty'), modal: $('#w-modal'),
  sheetBtn: $('#f-sheet-btn'), sheet: $('#f-sheet'),
};

// ---------- state <-> URL ----------
const params = new URLSearchParams(location.search);
const csv = (v) => (v ? v.split(',').filter(Boolean) : []);
const state = {
  service: SERVICE[params.get('service')] ? params.get('service') : 'all',
  industry: INDUSTRY[params.get('industry')] ? params.get('industry') : 'all',
  siteType: csv(params.get('type')).filter((k) => SITE_TYPE[k]),
  skills: csv(params.get('skill')),
  q: params.get('q') || '',
  sort: params.get('sort') === 'new' ? 'new' : 'featured',
  open: params.get('p') || '',
  moreIndustries: false,
};
function syncURL() {
  const p = new URLSearchParams();
  if (state.service !== 'all') p.set('service', state.service);
  if (state.industry !== 'all') p.set('industry', state.industry);
  if (state.siteType.length) p.set('type', state.siteType.join(','));
  if (state.skills.length) p.set('skill', state.skills.join(','));
  if (state.q) p.set('q', state.q);
  if (state.sort !== 'featured') p.set('sort', state.sort);
  if (state.open) p.set('p', state.open);
  const qs = p.toString();
  history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
}

// ---------- matching ----------
// Normalize: full/half-width (NFKC), lower case, hiragana -> katakana, so ワードプレス = わーどぷれす.
const toKata = (s) => s.replace(/[ぁ-ゖ]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0x60));
const norm = (s) => toKata(String(s ?? '').normalize('NFKC').toLowerCase()).replace(/\s+/g, ' ').trim();
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const LATIN = /^[a-z0-9][a-z0-9.+#/\- ]*$/;
const SYN = Object.fromEntries(Object.entries(SEARCH_SYNONYMS).map(([k, v]) => [norm(k), v.map(norm)]));

const allSkillNames = new Set([...SKILL_GROUPS.flatMap((g) => g.skills), ...WORKS.flatMap((w) => w.skills)].map(norm));
const index = new Map(WORKS.map((w) => [w.id, {
  skills: new Set(w.skills.map(norm)),
  text: norm([
    w.ja.title, w.ja.summary, w.ja.role, w.ja.result, w.en.title, w.en.summary, w.en.role, w.en.result,
    ...w.skills, w.year, SERVICE[w.service]?.ja, SERVICE[w.service]?.en, INDUSTRY[w.industry]?.ja, INDUSTRY[w.industry]?.en,
    ...w.siteType.flatMap((k) => [SITE_TYPE[k]?.ja, SITE_TYPE[k]?.en]),
  ].join(' \u0001 ')),
}]));

// One search term matches a project if any of its forms (the term itself or a synonym) matches:
//  - a known skill name ("java", "php") must match that skill exactly, or the same whole word in the text
//    (so "java" never matches "javascript")
//  - other Latin words match at the start of a word ("book" -> "booking")
//  - Japanese has no spaces, so it matches anywhere in the text
function termMatches(ix, term) {
  return [term, ...(SYN[term] || [])].some((t) => {
    if (allSkillNames.has(t)) return ix.skills.has(t) || new RegExp(`(^|[^a-z0-9])${reEsc(t)}([^a-z0-9]|$)`).test(ix.text);
    if (LATIN.test(t)) return new RegExp(`(^|[^a-z0-9])${reEsc(t)}`).test(ix.text);
    return ix.text.includes(t);
  });
}
// Multi-word skills ("google apps script", "llm / ai api") are kept together as one term.
const multiWordSkills = [...allSkillNames].filter((n) => n.includes(' ')).sort((a, b) => b.length - a.length);
function parseQuery(q) {
  let rest = ` ${norm(q)} `;
  const terms = [];
  for (const m of multiWordSkills) {
    if (rest.includes(` ${m} `)) { terms.push(m); rest = rest.replace(` ${m} `, ' '); }
  }
  return [...terms, ...rest.split(' ').filter(Boolean)];
}
let queryTerms = parseQuery(state.q);

// site type only applies while "Web Development" is selected
const siteTypeOn = () => state.service === 'web';

function match(w, skip) {
  if (skip !== 'service' && state.service !== 'all' && w.service !== state.service) return false;
  if (skip !== 'industry' && state.industry !== 'all' && w.industry !== state.industry) return false;
  if (skip !== 'siteType' && siteTypeOn() && state.siteType.length && !state.siteType.some((k) => w.siteType.includes(k))) return false;
  if (skip !== 'skills' && state.skills.length && !state.skills.some((k) => w.skills.includes(k))) return false;
  if (queryTerms.length) {
    const ix = index.get(w.id);
    if (!queryTerms.every((term) => termMatches(ix, term))) return false; // every term must match (AND)
  }
  return true;
}
const countBy = (skip, pred) => WORKS.reduce((n, w) => n + (match(w, skip) && pred(w) ? 1 : 0), 0);

// industries / site types that exist in the data (others are never shown)
const usedIndustries = INDUSTRIES.filter((i) => WORKS.some((w) => w.industry === i.key))
  .sort((a, b) => WORKS.filter((w) => w.industry === b.key).length - WORKS.filter((w) => w.industry === a.key).length);
const usedSiteTypes = SITE_TYPES.filter((s) => WORKS.some((w) => w.siteType.includes(s.key)));

// skills: grouped; every listed skill is shown in taxonomy order. Unlisted skills from the data join "Development".
const skillFreq = WORKS.flatMap((w) => w.skills).reduce((m, s) => m.set(s, (m.get(s) || 0) + 1), new Map());
const listed = new Set(SKILL_GROUPS.flatMap((g) => g.skills).map(norm));
const skillGroups = SKILL_GROUPS.map((g, gi) => {
  const extra = gi === 0 ? [...skillFreq.keys()].filter((s) => !listed.has(norm(s))) : [];
  // use the spelling from the data when it differs only in case
  const names = [...g.skills, ...extra].map((n) => [...skillFreq.keys()].find((k) => norm(k) === norm(n)) || n);
  // keep the order from taxonomy.js (grouped by kind); unlisted skills from the data come last
  return { ...g, names };
});
const allSkills = skillGroups.flatMap((g) => g.names);

// URL values: skills are case-insensitive, and site types only make sense for Web
state.skills = state.skills.map((s) => allSkills.find((k) => norm(k) === norm(s))).filter(Boolean);
if (!siteTypeOn()) state.siteType = [];

const TOP_INDUSTRIES = 8;

// ---------- render filters ----------
const chip = ({ key, text: txt, count, active, disabled, extra = '' }) =>
  `<button type="button" class="chip${active ? ' on' : ''}" data-key="${esc(key)}" aria-pressed="${active}"${disabled ? ' disabled' : ''}${extra}>${txt}${count != null ? `<span class="n">${count}</span>` : ''}</button>`;

function renderServices() {
  const all = countBy('service', () => true);
  els.service.innerHTML = chip({ key: 'all', text: esc(t('wf.all')), count: all, active: state.service === 'all' }) +
    SERVICES.map((s) => {
      const n = countBy('service', (w) => w.service === s.key);
      return chip({ key: s.key, text: esc(label(s)), count: n, active: state.service === s.key, disabled: !n && state.service !== s.key });
    }).join('');
}

function renderIndustries() {
  const all = countBy('industry', () => true);
  const items = usedIndustries.map((i) => ({ i, n: countBy('industry', (w) => w.industry === i.key) }));
  const visible = state.moreIndustries ? items : items.filter((x, idx) => idx < TOP_INDUSTRIES || x.i.key === state.industry);
  const more = items.length > TOP_INDUSTRIES
    ? `<button type="button" class="chip more" data-more>${esc(state.moreIndustries ? t('wf.less') : t('wf.more'))}</button>` : '';
  els.industry.innerHTML = chip({ key: 'all', text: esc(t('wf.all')), count: all, active: state.industry === 'all' }) +
    visible.map(({ i, n }) => chip({ key: i.key, text: esc(label(i)), count: n, active: state.industry === i.key, disabled: !n && state.industry !== i.key })).join('') + more;
}

const optionChips = (items, selected, skip, field) => items.map(({ key, text: txt }) => {
  const n = countBy(skip, (w) => w[field].includes(key));
  const on = selected.includes(key);
  return chip({ key, text: esc(txt), count: n, active: on, disabled: !n && !on });
}).join('');

function renderDrop(el, items, selected, skip, field, title, groups) {
  const btn = el.querySelector('.drop-btn'), panel = el.querySelector('.drop-options');
  btn.querySelector('.drop-label').textContent = title;
  btn.querySelector('.drop-n').textContent = selected.length ? selected.length : '';
  panel.innerHTML = groups
    ? groups.map((g) => `<p class="drop-group">${esc(label(g))}</p><div class="chips">${optionChips(g.names.map((n) => ({ key: n, text: n })), selected, skip, field)}</div>`).join('')
    : `<div class="chips">${optionChips(items, selected, skip, field)}</div>`;
}

function renderActive() {
  const pills = [];
  const pill = (type, key, txt) => pills.push(`<button type="button" class="pill" data-type="${type}" data-key="${esc(key)}">${esc(txt)}<span aria-hidden="true">×</span></button>`);
  if (state.service !== 'all') pill('service', state.service, label(SERVICE[state.service]));
  if (state.industry !== 'all') pill('industry', state.industry, label(INDUSTRY[state.industry]));
  if (siteTypeOn()) state.siteType.forEach((k) => pill('siteType', k, label(SITE_TYPE[k])));
  state.skills.forEach((k) => pill('skills', k, k));
  if (state.q) pill('q', '', `“${state.q}”`);
  els.active.innerHTML = pills.join('');
  els.clear.hidden = !pills.length;
  const filtersN = (siteTypeOn() ? state.siteType.length : 0) + state.skills.length;
  els.sheetBtn.querySelector('.n').textContent = filtersN || '';
}

// ---------- render results ----------
function sorted(list) {
  const byYear = (a, b) => (b.year || 0) - (a.year || 0);
  return [...list].sort(state.sort === 'new' ? (a, b) => byYear(a, b) || b.featured - a.featured : (a, b) => b.featured - a.featured || byYear(a, b));
}

function renderGrid() {
  const list = sorted(WORKS.filter((w) => match(w)));
  els.grid.innerHTML = list.map((w, i) => cardHTML(w, `?p=${encodeURIComponent(w.id)}`).replace('class="w-card"', `class="w-card" style="--i:${Math.min(i, 12)}"`)).join('');
  els.count.textContent = t('wf.count').replace('{n}', list.length);
  els.empty.hidden = list.length > 0;
}

function render() {
  els.site.hidden = !siteTypeOn() || !usedSiteTypes.length;
  renderServices();
  renderIndustries();
  renderDrop(els.site, usedSiteTypes.map((s) => ({ key: s.key, text: label(s) })), state.siteType, 'siteType', 'siteType', t('wf.siteType'));
  renderDrop(els.skill, null, state.skills, 'skills', 'skills', t('wf.skills'), skillGroups);
  els.sort.value = state.sort;
  renderActive();
  renderGrid();
  syncURL();
}

// ---------- events ----------
els.service.addEventListener('click', (e) => {
  const b = e.target.closest('.chip'); if (!b || b.disabled) return;
  state.service = b.dataset.key;
  if (!siteTypeOn()) state.siteType = [];
  render();
});
els.industry.addEventListener('click', (e) => {
  const b = e.target.closest('.chip'); if (!b || b.disabled) return;
  if (b.hasAttribute('data-more')) { state.moreIndustries = !state.moreIndustries; return render(); }
  state.industry = state.industry === b.dataset.key && b.dataset.key !== 'all' ? 'all' : b.dataset.key;
  render();
});
const toggle = (arr, k) => (arr.includes(k) ? arr.filter((x) => x !== k) : [...arr, k]);
els.site.querySelector('.drop-options').addEventListener('click', (e) => {
  const b = e.target.closest('.chip'); if (!b || b.disabled) return;
  state.siteType = toggle(state.siteType, b.dataset.key); render();
});
els.skill.querySelector('.drop-options').addEventListener('click', (e) => {
  const b = e.target.closest('.chip'); if (!b || b.disabled) return;
  state.skills = toggle(state.skills, b.dataset.key); render();
});

// dropdown open/close (desktop popovers)
document.querySelectorAll('.drop').forEach((d) => {
  d.querySelector('.drop-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !d.classList.contains('open');
    document.querySelectorAll('.drop.open').forEach((x) => x.classList.remove('open'));
    d.classList.toggle('open', open);
    d.querySelector('.drop-btn').setAttribute('aria-expanded', open);
  });
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.drop')) document.querySelectorAll('.drop.open').forEach((x) => { x.classList.remove('open'); x.querySelector('.drop-btn').setAttribute('aria-expanded', false); });
});

// mobile filter sheet
const setSheet = (open) => { document.body.classList.toggle('sheet-open', open); els.sheetBtn.setAttribute('aria-expanded', open); };
els.sheetBtn.addEventListener('click', () => setSheet(!document.body.classList.contains('sheet-open')));
document.querySelectorAll('[data-sheet-close]').forEach((b) => b.addEventListener('click', () => setSheet(false)));

let qTimer;
els.q.value = state.q;
els.q.addEventListener('input', () => { clearTimeout(qTimer); qTimer = setTimeout(() => { state.q = els.q.value.trim(); queryTerms = parseQuery(state.q); render(); }, 150); });
els.sort.addEventListener('change', () => { state.sort = els.sort.value; render(); });

els.active.addEventListener('click', (e) => {
  const b = e.target.closest('.pill'); if (!b) return;
  const { type, key } = b.dataset;
  if (type === 'service') { state.service = 'all'; state.siteType = []; }
  else if (type === 'industry') state.industry = 'all';
  else if (type === 'q') { state.q = ''; els.q.value = ''; queryTerms = []; }
  else state[type] = state[type].filter((x) => x !== key);
  render();
});
const clearAll = () => {
  Object.assign(state, { service: 'all', industry: 'all', siteType: [], skills: [], q: '' });
  els.q.value = '';
  queryTerms = [];
  render();
};
els.clear.addEventListener('click', clearAll);
$('#w-empty-clear').addEventListener('click', clearAll);

// ---------- detail modal ----------
function openModal(id) {
  const w = WORKS.find((x) => x.id === id);
  if (!w) return;
  state.open = id;
  const x = text(w);
  const meta = [label(SERVICE[w.service]), label(INDUSTRY[w.industry]), ...w.siteType.map((k) => label(SITE_TYPE[k])), w.year].filter(Boolean);
  const section = (k, v) => (v ? `<div class="m-sec"><h4>${esc(t(k))}</h4><p>${esc(v)}</p></div>` : '');
  els.modal.querySelector('.m-content').innerHTML = `
    ${thumbHTML(w, true)}
    <div class="m-body">
      <p class="m-meta">${meta.map((m) => `<span>${esc(m)}</span>`).join('')}</p>
      <h2 id="m-title">${esc(x.title)}</h2>
      <p class="m-sum">${esc(x.summary)}</p>
      ${section('wm.role', x.role)}
      ${section('wm.result', x.result)}
      <div class="m-sec"><h4>${esc(t('wm.skills'))}</h4><ul class="w-tags">${w.skills.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
      ${w.sample ? `<p class="m-note">${esc(t('wm.sampleNote'))}</p>` : ''}
      <div class="m-actions">
        ${w.url ? `<a class="btn" href="${esc(w.url)}" target="_blank" rel="noopener">${esc(t('wm.visit'))} ↗</a>` : ''}
        <a class="btn ghost" href="index.html#contact">${esc(t('wm.contact'))}</a>
      </div>
    </div>`;
  if (!els.modal.open) els.modal.showModal();
  syncURL();
}
function closeModal() { if (els.modal.open) els.modal.close(); }
els.modal.addEventListener('close', () => { state.open = ''; syncURL(); });
els.modal.addEventListener('click', (e) => { if (e.target === els.modal || e.target.closest('[data-close]')) closeModal(); });
els.grid.addEventListener('click', (e) => {
  const a = e.target.closest('.w-card'); if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
  e.preventDefault();
  openModal(a.dataset.id);
});

onLangChange(() => { render(); if (state.open) openModal(state.open); });

render();
if (state.open) openModal(state.open);
