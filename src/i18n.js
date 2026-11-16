// Simple dictionary-based i18n. Japanese is the default; choice is remembered per browser.
// Elements use data-i18n="key" (innerHTML) or data-i18n-attr="attr:key,attr2:key2".

export const DICT = {
  ja: {
    'meta.title': 'Your Name — AI活用・業務自動化・Web/システム開発',
    'meta.desc': '開発経験10年以上。PHP・Pythonによる Web/システム開発と、AI導入・業務自動化でビジネス課題の解決を支援します。',
    skip: '本文へ移動',
    'loader.msgs': ['準備しています', 'かたちを組み立てています', '色を整えています', 'まもなく始まります'],
    'nav.about': 'About', 'nav.services': 'Services', 'nav.work': 'Works', 'nav.contact': '新規案件 受付中',
    'clock.label': '日本の現在時刻', menu: 'メニュー',
    eyebrow: 'AI × BUSINESS SYSTEM DEVELOPER',
    'hero.title': 'AIを、<br /><em>成果</em>につなげる<br />しくみづくり。',
    'hero.lead': '開発経験10年以上。PHP・Pythonによるシステム開発の技術を活かし、AIの導入・活用と既存システムとの連携で、ビジネス課題の解決を支援します。',
    'hero.status': 'ただいま新規のご相談を受け付けています',
    'hero.cta1': 'ご相談はこちら →', 'hero.cta2': '支援内容を見る',
    scroll: 'SCROLL',

    'avatar.alt': 'Your Name のロゴ（鶴と富士山）',
    'about.no': '01 — ABOUT', 'about.title': '導入することより、<br />「何のために、どう使うか」。',
    'about.body': '10年以上、PHPやPythonを用いたWeb・システム開発に携わってきました。これから大切なのは、AIを導入すること自体ではなく、何のために、どのように活用し、安全かつ効果的にビジネスの成果へつなげるかという視点です。技術的な実現可能性だけでなく、安全性・運用性・費用対効果まで考えたご提案をします。',
    stat1: '年以上の開発経験', stat2: '主な開発言語（PHP / JS / Java / Python）', stat3: '% 費用対効果を重視',
    'q.title': 'こんなお悩みはありませんか？',
    q1: '自社の業務に、AIをどう活用できるのか分からない',
    q2: '手作業を減らして、業務の効率を高めたい',
    q3: 'セキュリティや情報管理に配慮しながら、既存システムと連携したい',

    'svc.no': '02 — SERVICES', 'svc.title': '支援領域',
    'svc.main': 'AI活用・業務自動化', 'svc.sub': 'Web・システム開発',
    's1.t': 'AI導入・活用支援', 's1.d': '業務課題に応じたAI活用方法の検討から導入まで。',
    's2.t': '業務プロセスの自動化', 's2.d': 'Python / GAS で反復作業や定型業務を効率化。',
    's3.t': 'データ処理・レポート作成', 's3.d': 'Excel・CSV の加工、集計、情報整理を自動化。',
    's4.t': 'AIによる文書処理', 's4.d': '文書の要約・情報抽出・分類などを業務に組み込み。',
    's5.t': '安全なAI活用環境の構築', 's5.d': '情報管理と運用面に配慮した実装・改善。',
    's6.t': 'Web・システム開発', 's6.d': 'PHP / Python による Webアプリの設計・構築・保守。',
    'w1.t': 'Webサイト・LP制作', 'w1.d': '企業サイト、サービスサイト、集客用ランディングページ。',
    'w2.t': 'Webアプリケーション開発', 'w2.d': '業務やサービスのニーズに合わせたWebシステム。',
    'w3.t': '業務システムの開発・改善', 'w3.d': '業務管理・データ管理など、実務に直結するしくみ。',
    'w4.t': '既存システムの保守・機能拡張', 'w4.d': '今の環境を活かした機能追加や改善。',
    'w5.t': 'デザイン制作', 'w5.d': 'Figma・Photoshop・Illustrator を使ったWebデザイン、UI設計、バナー・グラフィック制作。',

    'values.no': '04 — VALUES', 'values.title': '「次回もお願いしたい」と<br />言っていただけることが、何よりの喜びです。',
    'values.body': 'まずは、現在のお悩みや状況をお聞かせください。一緒に考えながら、今本当に必要なことを整理し、最適な一歩を見つけていきます。',
    'skills.title': 'つかえる技術',

    'contact.no': '05 — CONTACT', 'contact.title': 'まずは、お気軽にご相談ください。',
    'contact.body': 'ご相談・お見積りは無料です。内容を確認のうえ、ご連絡いたします。',
    'work.no': '03 — WORKS', 'work.title': '注目の制作実績',
    'work.note': '※ 「サンプル」と表示された実績は見本です。実際の案件に差し替えてください。',
    'feat.all': 'すべての実績を見る →',
    'works.meta.title': '制作実績 — Your Name',
    'works.meta.desc': 'Web開発・システム導入・ゲーム開発・モバイル開発の制作実績。業種・サイト種別・技術で絞り込めます。',
    'works.no': 'WORKS', 'works.title': '制作実績',
    'works.lead': 'サービスと業種から、ご要望に近い事例を探せます。サイト種別や使用技術でさらに絞り込めます。',
    'wf.search': 'キーワードで検索（例：予約、WordPress、HP）', 'wf.filters': '絞り込み',
    'wf.service': 'サービス', 'wf.industry': '業種', 'wf.siteType': 'サイト種別', 'wf.skills': '使用技術',
    'wf.all': 'すべて', 'wf.more': 'もっと見る ▾', 'wf.less': '閉じる ▴', 'wf.clear': '条件をクリア',
    'wf.count': '{n}件の実績', 'wf.sort': '並び順', 'wf.sort.featured': 'おすすめ順', 'wf.sort.new': '新しい順',
    'wf.apply': '結果を見る', 'wf.sample': 'サンプル',
    'wf.empty': '条件に合う実績が見つかりませんでした。条件を減らすか、お気軽にご相談ください。',
    'wm.role': '担当範囲', 'wm.result': '成果', 'wm.skills': '使用技術', 'wm.visit': 'サイトを見る',
    'wm.contact': 'この内容で相談する', 'wm.close': '閉じる',
    'wm.sampleNote': '※ この事例はサンプルです。実際の案件に差し替えてください。',
    'shape.show': '{label} を表示',
    shapes: {
      crane: ['鶴', '技術で、高く遠くへ'],
      heart: ['真心', '心を込めて、丁寧に'], auto: ['自動化', '手作業を減らす'],
      data: ['データ', '集計・レポートを自動で'], web: ['Web', 'サイト・LP・Webアプリ'], system: ['システム連携', '安全に、既存環境へ'],
    },
  },
  en: {
    'meta.title': 'Your Name — AI Adoption, Automation & Web/System Development',
    'meta.desc': '10+ years of PHP and Python development. I help businesses solve real problems with AI adoption, workflow automation and system integration.',
    skip: 'Skip to content',
    'loader.msgs': ['Warming up', 'Building shapes', 'Mixing colors', 'Almost there'],
    'nav.about': 'About', 'nav.services': 'Services', 'nav.work': 'Work', 'nav.contact': 'Open for work',
    'clock.label': 'Current time in Japan', menu: 'Menu',
    eyebrow: 'AI × BUSINESS SYSTEM DEVELOPER',
    'hero.title': 'Turning AI into<br />real <em>business results</em>.',
    'hero.lead': '10+ years building web apps and systems in PHP and Python. Now I help businesses adopt AI and connect it to the systems they already use.',
    'hero.status': 'Available for new projects',
    'hero.cta1': 'Start a conversation →', 'hero.cta2': 'See services',
    scroll: 'SCROLL',

    'avatar.alt': 'Your Name logo (a crane and Mt. Fuji)',
    'about.no': '01 — ABOUT', 'about.title': 'Not just adopting AI,<br />but knowing why and how.',
    'about.body': "For over ten years I've built web applications and business systems with PHP and Python. What matters now isn't adopting AI for its own sake. It's knowing what it's for, how to use it, and how to turn it into results safely. I propose solutions that weigh security, maintainability and cost-effectiveness, not just technical feasibility.",
    stat1: '+ years of development', stat2: 'core languages (PHP / JS / Java / Python)', stat3: '% focused on ROI',
    'q.title': 'Sound familiar?',
    q1: "You're not sure how AI could help your business",
    q2: 'You want less manual work and more efficient operations',
    q3: 'You want to connect AI to existing systems without compromising security',

    'svc.no': '02 — SERVICES', 'svc.title': 'What I do',
    'svc.main': 'AI & Automation', 'svc.sub': 'Web & System Development',
    's1.t': 'AI adoption support', 's1.d': 'Finding the right AI use for your problem, then putting it in place.',
    's2.t': 'Workflow automation', 's2.d': 'Python and Google Apps Script for repetitive, routine tasks.',
    's3.t': 'Data processing & reports', 's3.d': 'Automated cleaning, aggregation and reporting for Excel and CSV.',
    's4.t': 'AI document processing', 's4.d': 'Summarizing, extracting and classifying documents inside your workflow.',
    's5.t': 'Secure AI environments', 's5.d': 'Implementation that respects data handling and day-to-day operations.',
    's6.t': 'Web & system development', 's6.d': 'Design, build and maintenance of web apps in PHP and Python.',
    'w1.t': 'Websites & landing pages', 'w1.d': 'Company sites, service sites, and landing pages built to convert.',
    'w2.t': 'Web applications', 'w2.d': 'Web systems shaped around your business and service needs.',
    'w3.t': 'Business systems', 'w3.d': 'Operations and data management tools that support daily work.',
    'w4.t': 'Maintenance & new features', 'w4.d': 'Improving and extending the systems you already have.',
    'w5.t': 'Design', 'w5.d': 'Web design, UI layouts, banners and graphics in Figma, Photoshop and Illustrator.',

    'values.no': '04 — VALUES', 'values.title': 'Nothing makes me happier than hearing<br />"I\'d like to work with you again."',
    'values.body': "Start by telling me about your situation and what's bothering you. We'll work out together what you really need now, and find the best first step.",
    'skills.title': 'Toolbox',

    'contact.no': '05 — CONTACT', 'contact.title': "Let's talk about your challenge.",
    'contact.body': "Consultations and quotes are free. I'll review your message and get back to you.",
    'work.no': '03 — WORK', 'work.title': 'Featured work',
    'work.note': '* Projects marked "Sample" are placeholders. Replace them with your real work.',
    'feat.all': 'See all projects →',
    'works.meta.title': 'Works — Your Name',
    'works.meta.desc': 'Projects in web development, system implementation, game and mobile development. Filter by industry, site type and skills.',
    'works.no': 'WORKS', 'works.title': 'Projects',
    'works.lead': 'Find projects close to what you need by service and industry, then narrow down by site type and skills.',
    'wf.search': 'Search keywords (e.g. booking, WordPress, HP)', 'wf.filters': 'Filters',
    'wf.service': 'Service', 'wf.industry': 'Industry', 'wf.siteType': 'Site type', 'wf.skills': 'Skills',
    'wf.all': 'All', 'wf.more': 'More ▾', 'wf.less': 'Less ▴', 'wf.clear': 'Clear all',
    'wf.count': '{n} projects', 'wf.sort': 'Sort', 'wf.sort.featured': 'Featured first', 'wf.sort.new': 'Newest first',
    'wf.apply': 'Show results', 'wf.sample': 'Sample',
    'wf.empty': 'No projects match these filters. Try removing some, or just get in touch.',
    'wm.role': 'My role', 'wm.result': 'Results', 'wm.skills': 'Skills used', 'wm.visit': 'Visit site',
    'wm.contact': 'Ask about a project like this', 'wm.close': 'Close',
    'wm.sampleNote': '* This is a sample project. Replace it with your real work.',
    'shape.show': 'Show {label}',
    shapes: {
      crane: ['CRANE', 'Technology that takes you further'],
      heart: ['WITH HEART', 'Heart and effort in every detail'], auto: ['AUTOMATE', 'Less manual work'],
      data: ['DATA', 'Reports that build themselves'], web: ['WEB', 'Sites, LPs & web apps'], system: ['INTEGRATE', 'Safely, into what you have'],
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
  const meta = document.body.dataset.meta || 'meta';
  document.title = t(meta + '.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t(meta + '.desc'));
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
