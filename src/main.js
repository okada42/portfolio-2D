import { SHAPES, buildIntro } from './shapes.js';
import { apply, setLang, t, onLangChange } from './i18n.js';

const $ = (s) => document.querySelector(s);
apply();

// mobile menu
const header = $('.header'), menuBtn = $('.menu-btn');
const setMenu = (open) => { header.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open); };
menuBtn.addEventListener('click', () => setMenu(!header.classList.contains('open')));
$('#site-nav').addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
document.querySelector('.lang-switch').addEventListener('click', (e) => {
  const b = e.target.closest('[data-lang]');
  if (b) setLang(b.dataset.lang);
});
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
    onDone = () => scene.start();
    if (finished) scene.start();
    bump(10);
  } catch (err) {
    console.warn('3D scene failed to start', err);
    target = 100;
  }
})();

// ---------- live clock: Japan time, era date and the current 24 solar term ----------
const TERMS_JA = ['立春','雨水','啓蟄','春分','清明','穀雨','立夏','小満','芒種','夏至','小暑','大暑','立秋','処暑','白露','秋分','寒露','霜降','立冬','小雪','大雪','冬至','小寒','大寒'];
const TERMS_EN = ['Start of Spring','Rain Water','Insects Awaken','Spring Equinox','Clear and Bright','Grain Rain','Start of Summer','Grain Buds','Grain in Ear','Summer Solstice','Minor Heat','Major Heat','Start of Autumn','End of Heat','White Dew','Autumn Equinox','Cold Dew','Frost Descent','Start of Winter','Minor Snow','Major Snow','Winter Solstice','Minor Cold','Major Cold'];
// Sun's apparent ecliptic longitude (low-precision, good to ~0.01°); terms start every 15° from 315° (立春).
function solarTerm(date) {
  const d = date.getTime() / 86400000 + 2440587.5 - 2451545.0;
  const rad = Math.PI / 180;
  const g = (357.529 + 0.98560028 * d) * rad;
  const L = 280.459 + 0.98564736 * d + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g);
  return Math.floor((((L - 315) % 360) + 360) % 360 / 15);
}
const TZ = 'Asia/Tokyo';
const fmtTime = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
const fmtEra = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', { timeZone: TZ, era: 'long', year: 'numeric' });
const fmtJa = new Intl.DateTimeFormat('ja-JP', { timeZone: TZ, month: 'numeric', day: 'numeric', weekday: 'short' });
const fmtEn = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
const timeEl = $('.clock-time'), dateEl = $('.clock-date');
function tickClock() {
  const now = new Date();
  timeEl.textContent = fmtTime.format(now);
  const term = solarTerm(now);
  if (document.documentElement.lang === 'ja') {
    const p = Object.fromEntries(fmtJa.formatToParts(now).map((x) => [x.type, x.value]));
    dateEl.textContent = `${fmtEra.format(now)} ${p.month}月${p.day}日（${p.weekday}）・${TERMS_JA[term]}`;
  } else {
    dateEl.textContent = `${fmtEn.format(now)} · ${TERMS_EN[term]} · JST`;
  }
}
tickClock(); setInterval(tickClock, 1000);
onLangChange(tickClock);
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
