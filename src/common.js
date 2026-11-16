// Shared by every page: i18n, header (menu, language switch, clock), scroll reveal, footer year.
import { apply, setLang, onLangChange } from './i18n.js';

const $ = (s) => document.querySelector(s);

export function initCommon() {
  apply();

  // mobile menu
  const header = $('.header'), menuBtn = $('.menu-btn');
  const setMenu = (open) => { header.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open); };
  menuBtn.addEventListener('click', () => setMenu(!header.classList.contains('open')));
  $('#site-nav').addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  $('.lang-switch').addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (b) setLang(b.dataset.lang);
  });

  initClock();
  $('.year').textContent = new Date().getFullYear();
  observeReveal(document);
}

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
function initClock() {
  const TZ = 'Asia/Tokyo';
  const fmtTime = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const fmtEra = new Intl.DateTimeFormat('ja-JP-u-ca-japanese', { timeZone: TZ, era: 'long', year: 'numeric' });
  const fmtJa = new Intl.DateTimeFormat('ja-JP', { timeZone: TZ, month: 'numeric', day: 'numeric', weekday: 'short' });
  const fmtEn = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const timeEl = $('.clock-time'), dateEl = $('.clock-date');
  if (!timeEl) return;
  const tick = () => {
    const now = new Date();
    timeEl.textContent = fmtTime.format(now);
    const term = solarTerm(now);
    if (document.documentElement.lang === 'ja') {
      const p = Object.fromEntries(fmtJa.formatToParts(now).map((x) => [x.type, x.value]));
      dateEl.textContent = `${fmtEra.format(now)} ${p.month}月${p.day}日（${p.weekday}）・${TERMS_JA[term]}`;
    } else {
      dateEl.textContent = `${fmtEn.format(now)} · ${TERMS_EN[term]} · JST`;
    }
  };
  tick(); setInterval(tick, 1000);
  onLangChange(tick);
}

// ---------- scroll reveal + counters ----------
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    e.target.classList.add('is-in');
    e.target.querySelectorAll?.('[data-count]').forEach(countUp);
    io.unobserve(e.target);
  }
}, { rootMargin: '0px 0px -8% 0px' });

export function observeReveal(root) {
  root.querySelectorAll('.reveal:not(.is-in)').forEach((el, i) => { el.style.setProperty('--d', (i % 4) * 80 + 'ms'); io.observe(el); });
}

function countUp(el) {
  const end = +el.dataset.count, t0 = performance.now(), dur = 1200;
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur);
    el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
