import { SHAPES, buildIntro } from './shapes.js';
import { t, onLangChange } from './i18n.js';
import { initCommon, observeReveal } from './common.js';
import { WORKS, cardHTML } from './works-render.js';

// ---------- featured works (projects marked featured in data/works.csv) ----------
function renderFeatured() {
  const grid = document.querySelector('#featured-grid');
  // real projects always before samples, then newest first
  const list = WORKS.filter((w) => w.featured).sort((a, b) => a.sample - b.sample || (b.year || 0) - (a.year || 0)).slice(0, 8);
  grid.innerHTML = list.map((w) => cardHTML(w, `works.html?p=${encodeURIComponent(w.id)}`).replace('class="w-card"', 'class="w-card reveal"')).join('');
  document.querySelector('#featured-note').hidden = !list.some((w) => w.sample);
  observeReveal(grid);
}
onLangChange(renderFeatured);

const $ = (s) => document.querySelector(s);
initCommon();
renderFeatured();

const small = Math.min(innerWidth, innerHeight) < 700;
const COUNT = small ? 11000 : 22000;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- loader: shown % eases toward real progress ----------
const bar = $('.loader-bar span'), pctEl = $('.loader-pct'), msgEl = $('.loader-msg'), loaderEl = $('.loader');
let target = 0, shown = 0, finished = false;
const bump = (n) => {
  target = Math.min(100, target + n);
  if (target > 99.5) target = 100; // float sums like 6 × (50/6) land at 99.999…
};
let onDone = () => {};
(function loop() {
  shown += Math.max((target - shown) * 0.08, target > shown ? 0.3 : 0);
  if (shown > target) shown = target;
  bar.style.width = shown + '%';
  pctEl.textContent = Math.floor(shown) + '%';
  msgEl.textContent = t('loader.msgs')[Math.min(3, Math.floor(shown / 26))];
  loaderEl.setAttribute('aria-valuenow', Math.floor(shown));
  if (shown >= 100) {
    if (!finished) { finished = true; setTimeout(() => { document.body.classList.remove('is-loading'); onDone(); }, 300); }
    return;
  }
  requestAnimationFrame(loop);
})();

const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]);
fonts.then(() => bump(20));

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

(async () => {
  if (!hasWebGL()) { await fonts; target = 100; return; }
  try {
    const { createScene } = await import('./particles.js');
    bump(20);
    await fonts; // glyph shapes need the font loaded
    const built = [];
    for (const s of SHAPES) {
      built.push({ ...s, ...(await s.build(COUNT)) });
      bump(50 / SHAPES.length);
      await new Promise((r) => setTimeout(r, 0)); // keep UI responsive
    }
    const ui = $('.shape-ui'), cap = $('.shape-caption'), dots = $('.shape-dots');
    dots.innerHTML = built.map((s, i) => `<li><button type="button" data-i="${i}"></button></li>`).join('');
    let current = 0;
    const renderShapeUI = (animate) => {
      const [label, sub] = t('shapes')[built[current].key];
      cap.innerHTML = `<span class="num">${String(current + 1).padStart(2, '0')}</span><strong>${label}</strong><small>${sub}</small>`;
      if (animate) { cap.classList.remove('swap'); void cap.offsetWidth; cap.classList.add('swap'); }
      dots.querySelectorAll('button').forEach((b, j) => {
        b.setAttribute('aria-current', j === current);
        b.setAttribute('aria-label', t('shape.show').replace('{label}', t('shapes')[built[j].key][0]));
      });
    };
    onLangChange(() => renderShapeUI(false));
    const scene = createScene($('.stage'), built, {
      count: COUNT, small, reduceMotion, intro: buildIntro(COUNT),
      onShape(i) { current = i; renderShapeUI(true); },
    });
    renderShapeUI(false);
    dots.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) scene.goTo(+b.dataset.i); });
    ui.hidden = false;
    // re-fit the scene on phones once the caption is visible, and whenever the text changes size
    scene.relayout();
    onLangChange(() => requestAnimationFrame(() => scene.relayout()));
    document.fonts?.ready.then(() => scene.relayout());
    onDone = () => scene.start();
    if (finished) scene.start();
    bump(10);
  } catch (err) {
    console.warn('3D scene failed to start', err);
    target = 100;
  }
})();
