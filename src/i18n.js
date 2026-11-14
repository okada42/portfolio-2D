// Simple dictionary-based i18n. Japanese is the default; choice is remembered per browser.
// Elements use data-i18n="key" (innerHTML) or data-i18n-attr="attr:key,attr2:key2".

export const DICT = {
  ja: {
    'meta.title': 'Your Name — ポートフォリオ',
    'meta.desc': 'Your Name のポートフォリオ。Web・3D・インタラクティブ開発。',
    skip: '本文へ移動',
    'loader.msgs': ['準備しています', 'かたちを組み立てています', '色を整えています', 'まもなく始まります'],
    'nav.about': 'About', 'nav.work': 'Works', 'nav.skills': 'Skills', 'nav.contact': 'お問い合わせ',
    'clock.label': '現在時刻',
    eyebrow: 'クリエイティブ・デベロッパー',
    'hero.title': '<em>動き</em>のある<br />Webを、<br />つくります。',
    'hero.lead': 'Webサイト、インタラクティブな3D、小さなゲームまで。企画からデザイン・実装・公開まで、ひとりで一貫して手がけます。',
    'hero.status': 'ただいま新規のご依頼を受け付けています',
    'hero.cta1': '制作実績を見る →', 'hero.cta2': 'お問い合わせ',
    scroll: 'SCROLL',
    'about.no': '01 — ABOUT', 'about.title': 'はじめまして、Your Name です。',
    'about.body': 'ここに自己紹介を2〜3文で書いてください。どんな人で、何をつくるのが好きで、どんなお仕事を探しているかを伝えましょう。',
    'stat1': '公開したプロジェクト', 'stat2': '年のコーディング経験', 'stat3': '% 手づくり',
    'work.no': '02 — SELECTED WORKS', 'work.title': '最近の制作実績',
    'p1.title': 'プロジェクト 1', 'p1.desc': '概要 · React · three.js',
    'p2.title': 'プロジェクト 2', 'p2.desc': '概要 · Next.js',
    'p3.title': 'プロジェクト 3', 'p3.desc': '概要 · Canvas ゲーム',
    'p4.title': 'プロジェクト 4', 'p4.desc': '概要 · WordPress',
    'skills.no': '03 — SKILLS', 'skills.title': 'つかえる技術',
    'contact.no': '04 — CONTACT', 'contact.title': 'いっしょに、つくりましょう。',
    'shape.show': '{label} を表示',
    'lang.switch': 'Switch to English',
    shapes: {
      name: ['こんにちは', 'Your Name'], code: ['コード', 'フロントエンドと3D'], web: ['ウェブ', '人に届くサイトを'],
      craft: ['こだわり', '動きの細部まで'], grow: ['成長', '学びつづける'], system: ['設計', '堅実なアーキテクチャ'],
    },
  },
  en: {
    'meta.title': 'Your Name — Portfolio',
    'meta.desc': 'Portfolio of Your Name: web, 3D and interactive development.',
    skip: 'Skip to content',
    'loader.msgs': ['Warming up', 'Building shapes', 'Mixing colors', 'Almost there'],
    'nav.about': 'About', 'nav.work': 'Work', 'nav.skills': 'Skills', 'nav.contact': 'Contact',
    'clock.label': 'Local time',
    eyebrow: 'CREATIVE DEVELOPER',
    'hero.title': 'I build things<br />that <em>move</em>.',
    'hero.lead': 'Websites, interactive 3D and small games, designed and coded by one person from idea to launch.',
    'hero.status': 'Available for new projects',
    'hero.cta1': 'See my work →', 'hero.cta2': 'Get in touch',
    scroll: 'SCROLL',
    'about.no': '01 — ABOUT', 'about.title': "Hi, I'm Your Name.",
    'about.body': "Write two or three sentences about who you are, what you love making, and what kind of work you're looking for.",
    'stat1': 'Projects shipped', 'stat2': 'Years coding', 'stat3': '% hand-made',
    'work.no': '02 — SELECTED WORK', 'work.title': 'Recent projects',
    'p1.title': 'Project One', 'p1.desc': 'Short description · React · three.js',
    'p2.title': 'Project Two', 'p2.desc': 'Short description · Next.js',
    'p3.title': 'Project Three', 'p3.desc': 'Short description · Canvas game',
    'p4.title': 'Project Four', 'p4.desc': 'Short description · WordPress',
    'skills.no': '03 — SKILLS', 'skills.title': 'Toolbox',
    'contact.no': '04 — CONTACT', 'contact.title': "Let's make something.",
    'shape.show': 'Show {label}',
    'lang.switch': '日本語に切り替え',
    shapes: {
      name: ['HELLO', 'Your Name'], code: ['CODE', 'Frontend & 3D'], web: ['WEB', 'Sites that reach people'],
      craft: ['CRAFT', 'Detail in motion'], grow: ['GROW', 'Always learning'], system: ['SYSTEMS', 'Solid architecture'],
    },
  },
};

const KEY = 'lang';
function initial() {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'ja') return q;
    const saved = localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'ja') return saved;
  } catch {}
  return 'ja';
}

let lang = initial();
const listeners = new Set();
export const getLang = () => lang;
export const t = (k) => DICT[lang][k] ?? DICT.ja[k] ?? k;
export const onLangChange = (fn) => listeners.add(fn);

export function apply() {
  document.documentElement.lang = lang;
  document.title = t('meta.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.desc'));
  document.querySelectorAll('[data-i18n]').forEach((el) => (el.innerHTML = t(el.dataset.i18n)));
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(',').forEach((pair) => {
      const [attr, key] = pair.split(':');
      el.setAttribute(attr, t(key));
    });
  });
  document.querySelectorAll('.lang-switch [data-lang]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.lang === lang));
  listeners.forEach((fn) => fn(lang));
}

export function setLang(next) {
  if (next === lang) return;
  lang = next;
  try { localStorage.setItem(KEY, lang); } catch {}
  apply();
}
