import { SHAPES } from './shapes.js';
import { apply, setLang, t, onLangChange } from './i18n.js';

const $ = (s) => document.querySelector(s);
apply();
document.querySelector('.lang-switch').addEventListener('click', (e) => {
  const b = e.target.closest('[data-lang]');
  if (b) setLang(b.dataset.lang);
});
const small = Math.min(innerWidth, innerHeight) < 700;
const COUNT = small ? 9000 : 18000;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- loader: shown % eases toward real progress ----------
const bar = $('.loader-bar span'), pctEl = $('.loader-pct'), msgEl = $('.loader-msg'), loaderEl = $('.loader');
let target = 0, shown = 0, finished = false;
const bump = (n) => (target = Math.min(100, target + n));
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
      built.push({ ...s, ...s.build(COUNT) });
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
      count: COUNT, small, reduceMotion,
      onShape(i) { current = i; renderShapeUI(true); },
    });
    renderShapeUI(false);
    dots.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) scene.goTo(+b.dataset.i); });
    ui.hidden = false;
    onDone = () => scene.start();
    if (finished) scene.start();
    bump(10);
  } catch (err) {
    console.warn('3D scene failed to start', err);
    target = 100;
  }
})();

// ---------- live clock ----------
const clockEl = $('.clock');
const tickClock = () => (clockEl.textContent = new Date().toLocaleTimeString([], { hour12: false }));
tickClock(); setInterval(tickClock, 1000);
$('.year').textContent = new Date().getFullYear();

// ---------- scroll reveal + counters ----------
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('is-in');
    e.target.querySelectorAll?.('[data-count]').forEach(countUp);
    io.unobserve(e.target);
  }
}, { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach((el, i) => { el.style.setProperty('--d', (i % 4) * 80 + 'ms'); io.observe(el); });

function countUp(el) {
  const end = +el.dataset.count, t0 = performance.now(), dur = 1200;
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur);
    el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
