// Simple dictionary-based i18n. Japanese is the default on every visit; switching to English
// lasts for the current browsing session (so it carries across pages) and resets next time.
// Elements use data-i18n="key" (innerHTML) or data-i18n-attr="attr:key,attr2:key2".

export const DICT = {
  ja: {
    'meta.title': 'Serion — AI活用・業務自動化・Web/システム開発',
    'meta.desc': '開発歴10年以上のエンジニア Serion のポートフォリオ。PHP・Pythonでのシステム開発の経験を活かし、AI導入・業務自動化・Web制作でビジネスの課題解決をお手伝いします。',
    skip: '本文へスキップ',
    'loader.msgs': ['読み込んでいます', 'かたちを組み立てています', '色を整えています', 'まもなく表示します'],
    'nav.about': 'About', 'nav.services': 'Services', 'nav.work': 'Works', 'nav.contact': '新規案件 受付中',
    'clock.label': '日本の現在時刻', menu: 'メニュー',
    eyebrow: 'AI × BUSINESS SYSTEMS DEVELOPER',
    'hero.title': 'AIを、<br /><em>成果</em>につなげる<br />しくみづくり。',
    'hero.lead': '開発歴10年以上のエンジニアです。PHP・Pythonでのシステム開発の経験を活かし、AIの導入から既存システムとの連携まで、ビジネスの課題解決をお手伝いします。',
    'hero.status': 'ただいま新規のご相談を受け付けています',
    'hero.cta1': '無料で相談する →', 'hero.cta2': 'サービス内容を見る',
    scroll: 'SCROLL',

    'avatar.alt': 'Serion のロゴ（鶴と富士山）',
    'about.no': '01 — ABOUT', 'about.title': 'AIは「入れること」より、<br />「どう使うか」が大切です。',
    'about.body': 'これまで10年以上、PHPやPythonでWebサービスや業務システムの開発に携わってきました。AIは導入すること自体が目的ではありません。何のために、どう使い、どうすれば安全に成果へつなげられるか。その視点を大切に、技術的に実現できるかどうかだけでなく、セキュリティや運用のしやすさ、費用対効果まで含めてご提案します。',
    stat1: '年以上の開発経験', stat2: '主な開発言語（PHP / JS / Java / Python）', stat3: '% 成果を重視したご提案',
    'q.title': 'こんなお悩みはありませんか？',
    q1: 'AIを自社の業務にどう活かせばいいのか分からない',
    q2: '手作業を減らして、業務を効率化したい',
    q3: 'セキュリティに配慮しながら、今のシステムとAIを連携させたい',

    'svc.no': '02 — SERVICES', 'svc.title': 'サービス内容',
    'svc.main': 'AI活用・業務自動化', 'svc.sub': 'Web・システム開発',
    's1.t': 'AI導入・活用支援', 's1.d': '業務の課題に合わせて、AIの活かし方を一緒に考え、導入までサポートします。',
    's2.t': '業務の自動化', 's2.d': 'Python や GAS で、毎日の繰り返し作業や定型業務を自動化します。',
    's3.t': 'データ処理・レポート作成', 's3.d': 'Excel・CSV の加工や集計、レポート作成を自動化します。',
    's4.t': 'AIによる文書処理', 's4.d': '文書の要約・情報の抽出・分類を、日々の業務に組み込みます。',
    's5.t': '安全なAI活用環境の構築', 's5.d': '情報管理と運用面に配慮して、安心して使える仕組みを整えます。',
    's6.t': 'Web・システム開発', 's6.d': 'PHP・Python で Web アプリを設計・開発し、公開後の保守まで対応します。',
    'w1.t': 'ホームページ・LP制作', 'w1.d': 'コーポレートサイトやサービスサイト、集客につながるランディングページを制作します。',
    'w2.t': 'Webアプリケーション開発', 'w2.d': '業務やサービスの内容に合わせて、使いやすい Web システムを開発します。',
    'w3.t': '業務システムの開発・改善', 'w3.d': '業務管理やデータ管理など、現場ですぐに役立つ仕組みをつくります。',
    'w4.t': '既存システムの保守・機能追加', 'w4.d': '今お使いの環境を活かしながら、改善や機能追加を行います。',
    'w5.t': 'デザイン制作', 'w5.d': 'Figma・Photoshop・Illustrator で、Webデザイン・UI設計・バナーなどを制作します。',

    'values.no': '04 — VALUES', 'values.title': '「また次もお願いしたい」と<br />言っていただけることが、何よりの喜びです。',
    'values.body': 'まずは、今のお悩みや状況をお気軽にお聞かせください。一緒に整理しながら、本当に必要なことを見極め、最適な一歩をご提案します。',
    'skills.title': '対応できる技術・ツール',

    'contact.no': '05 — CONTACT', 'contact.title': 'まずは、お気軽にご相談ください。',
    'contact.body': 'ご相談・お見積もりは無料です。内容を確認のうえ、折り返しご連絡いたします。',
    'work.no': '03 — WORKS', 'work.title': '主な制作実績',
    'work.note': '※「サンプル」と表示されている実績は見本です。',
    'feat.all': '制作実績をすべて見る →',
    'works.meta.title': '制作実績 — Serion',
    'works.meta.desc': 'Web開発・システム導入・ゲーム開発・モバイルアプリ開発の制作実績です。業種・サイトの種類・使用技術から探せます。',
    'works.no': 'WORKS', 'works.title': '制作実績',
    'works.lead': 'サービスと業種から、ご希望に近い事例をお探しいただけます。サイトの種類や使用技術でさらに絞り込めます。',
    'wf.search': 'キーワードで探す（例：予約、WordPress、HP）', 'wf.filters': '絞り込み',
    'wf.service': 'サービス', 'wf.industry': '業種', 'wf.siteType': 'サイトの種類', 'wf.skills': '使用技術',
    'wf.all': 'すべて', 'wf.more': 'もっと見る ▾', 'wf.less': '閉じる ▴', 'wf.clear': '条件をリセット',
    'wf.total': '全{total}件', 'wf.count': '{total}件中 {n}件を表示', 'wf.sort': '並び順', 'wf.sort.featured': 'おすすめ順', 'wf.sort.new': '新しい順',
    'wf.apply': 'この条件で表示', 'wf.sample': 'サンプル',
    'wf.empty': '条件に合う実績が見つかりませんでした。条件を変えてお試しいただくか、お気軽にご相談ください。',
    'wm.role': '担当範囲', 'wm.result': '成果', 'wm.skills': '使用技術', 'wm.visit': 'サイトを見る',
    'wm.contact': '同じような案件を相談する', 'wm.close': '閉じる',
    'wm.sampleNote': '※ こちらは見本の事例です。',
    'brand.tagline': ' — Ideas Connected. Innovation in Motion.',
    'brand.label': 'Serion という名前に込めた想い',
    'brand.body1': 'Serion（セリオン）は、絶え間なく続く創造と、イノベーションが生み出すエネルギーをイメージした名前です。価値あるものづくりは、いつもひとつのアイデアから始まります。テクノロジーと創造力、そして細部まで考え抜いた設計が結びつくことで、ひとつのアイデアは、もっと大きなものへと育っていきます。',
    'brand.body2': 'Serion という名前が表しているのは、その歩みそのもの。アイデアから可能性へ、そしてイノベーションへ。途切れることなく続いていく、ものづくりの連なりです。',
    'brand.p1': 'アイデアをつなぐ', 'brand.p2': '心に残る体験をつくる', 'brand.p3': '前へ進み続ける',
    'brand.closing': 'Serion がつくるのは、目の前の「もの」だけではありません。その先にある「次」を、かたちにしていきます。',
    'shape.show': '{label}を表示',
    shapes: {
      crane: ['鶴', '技術で、より高く、より遠くへ'],
      heart: ['真心', 'ひとつひとつ、心を込めて'], auto: ['自動化', '手作業を、もっと少なく'],
      data: ['データ', '集計もレポートも自動で'], web: ['Web', 'ホームページ・LP・Webアプリ'], system: ['システム連携', '今ある仕組みに、安全につなぐ'],
    },
  },
  en: {
    'meta.title': 'Serion — AI Adoption, Automation & Web Development',
    'meta.desc': 'Serion is a developer with 10+ years of PHP and Python experience, helping businesses put AI to work through automation, integrations, and custom web systems.',
    skip: 'Skip to main content',
    'loader.msgs': ['Getting ready', 'Building shapes', 'Adding color', 'Almost there'],
    'nav.about': 'About', 'nav.services': 'Services', 'nav.work': 'Work', 'nav.contact': 'Open for work',
    'clock.label': 'Current time in Japan', menu: 'Menu',
    eyebrow: 'AI × BUSINESS SYSTEMS DEVELOPER',
    'hero.title': 'Putting AI to work<br />for <em>real results</em>.',
    'hero.lead': "I'm a developer with 10+ years of experience building web apps and business systems in PHP and Python. Today, I help companies adopt AI and connect it to the tools they already use.",
    'hero.status': 'Currently taking on new projects',
    'hero.cta1': "Let's talk →", 'hero.cta2': 'View services',
    scroll: 'SCROLL',

    'avatar.alt': 'Serion logo: a crane and Mt. Fuji',
    'about.no': '01 — ABOUT', 'about.title': "It's not about adding AI.<br />It's about using it well.",
    'about.body': "I've spent more than a decade building web applications and business systems with PHP and Python. Here's what I've learned: adding AI isn't the goal. What matters is knowing what you need it for, how to use it, and how to turn it into results safely. That's why my recommendations weigh security, ease of maintenance, and ROI, not just what's technically possible.",
    stat1: '+ years in development', stat2: 'core languages (PHP / JS / Java / Python)', stat3: '% focused on results',
    'q.title': 'Sound familiar?',
    q1: "You're not sure where AI fits in your business",
    q2: 'You want to spend less time on manual work',
    q3: 'You want to connect AI to your existing systems without putting your data at risk',

    'svc.no': '02 — SERVICES', 'svc.title': 'Services',
    'svc.main': 'AI & Automation', 'svc.sub': 'Web & System Development',
    's1.t': 'AI strategy & adoption', 's1.d': 'Finding where AI can actually help your business, then rolling it out.',
    's2.t': 'Workflow automation', 's2.d': 'Automating repetitive, everyday tasks with Python and Google Apps Script.',
    's3.t': 'Data processing & reporting', 's3.d': 'Automated cleanup, number crunching, and reports from your Excel and CSV files.',
    's4.t': 'AI document processing', 's4.d': 'Summarizing, extracting, and sorting documents as part of your daily workflow.',
    's5.t': 'Secure AI setup', 's5.d': 'AI tools built with data security and day-to-day operations in mind.',
    's6.t': 'Web & system development', 's6.d': 'Designing, building, and maintaining web apps in PHP and Python.',
    'w1.t': 'Websites & landing pages', 'w1.d': 'Company websites, product sites, and landing pages that convert.',
    'w2.t': 'Web applications', 'w2.d': 'Custom web apps built around the way your business works.',
    'w3.t': 'Business systems', 'w3.d': 'Operations and data management tools that make everyday work easier.',
    'w4.t': 'Maintenance & upgrades', 'w4.d': 'Improving and extending the systems you already have.',
    'w5.t': 'Design', 'w5.d': 'Web design, UI, banners, and graphics in Figma, Photoshop, and Illustrator.',

    'values.no': '04 — VALUES', 'values.title': 'Nothing beats hearing,<br />"Let\'s work together again."',
    'values.body': "Tell me where things stand and what's getting in the way. Together, we'll figure out what you actually need right now and find the best first step.",
    'skills.title': 'Tools & tech',

    'contact.no': '05 — CONTACT', 'contact.title': "Let's talk about your project.",
    'contact.body': "Consultations and quotes are always free. Send me a message, and I'll get back to you soon.",
    'work.no': '03 — WORK', 'work.title': 'Featured work',
    'work.note': '* Projects labeled "Sample" are placeholders.',
    'feat.all': 'View all projects →',
    'works.meta.title': 'Work — Serion',
    'works.meta.desc': 'Browse projects in web development, system implementation, games, and mobile apps. Filter by industry, site type, and skills.',
    'works.no': 'WORK', 'works.title': 'Projects',
    'works.lead': 'Browse by service and industry to find projects like yours, then narrow things down by site type and skills.',
    'wf.search': 'Search (e.g., booking, WordPress, website)', 'wf.filters': 'Filters',
    'wf.service': 'Service', 'wf.industry': 'Industry', 'wf.siteType': 'Site type', 'wf.skills': 'Skills',
    'wf.all': 'All', 'wf.more': 'Show more ▾', 'wf.less': 'Show less ▴', 'wf.clear': 'Clear filters',
    'wf.total': '{total} projects', 'wf.total1': '1 project', 'wf.count': 'Showing {n} of {total} projects', 'wf.sort': 'Sort by', 'wf.sort.featured': 'Featured', 'wf.sort.new': 'Newest',
    'wf.apply': 'Show results', 'wf.sample': 'Sample',
    'wf.empty': "No projects match your filters. Try removing one, or reach out and tell me what you're looking for.",
    'wm.role': 'My role', 'wm.result': 'Results', 'wm.skills': 'Tech used', 'wm.visit': 'Visit site',
    'wm.contact': 'Ask about a similar project', 'wm.close': 'Close',
    'wm.sampleNote': '* This is a sample project.',
    'brand.tagline': ' — Ideas Connected. Innovation in Motion.',
    'brand.label': 'The story behind the name',
    'brand.body1': 'Serion is a name inspired by the idea of continuous creation and the energy of innovation. Every meaningful creation begins with an idea. When technology, creativity, and thoughtful design come together, a single idea can grow into something greater.',
    'brand.body2': 'The name represents that journey: a continuous series of ideas, possibilities, and innovations brought to life.',
    'brand.p1': 'Connect ideas', 'brand.p2': 'Create meaningful experiences', 'brand.p3': 'Keep moving forward',
    'brand.closing': "Serion isn't just about building things. It's about creating what comes next.",
    'shape.show': 'Show {label}',
    shapes: {
      crane: ['CRANE', 'Technology that takes you further'],
      heart: ['WITH HEART', 'Care in every detail'], auto: ['AUTOMATE', 'Less busywork'],
      data: ['DATA', 'Reports that run themselves'], web: ['WEB', 'Websites, landing pages & web apps'], system: ['INTEGRATE', 'Secure connections to the systems you have'],
    },
  },
};

const KEY = 'lang';
function initial() {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'ja') return q;
    const saved = sessionStorage.getItem(KEY);
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
  try { sessionStorage.setItem(KEY, lang); } catch {}
  apply();
}
