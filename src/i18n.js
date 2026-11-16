// Simple dictionary-based i18n. Japanese is the default on every visit; switching to English
// lasts for the current browsing session (so it carries across pages) and resets next time.
// Elements use data-i18n="key" (innerHTML) or data-i18n-attr="attr:key,attr2:key2".

export const DICT = {
  ja: {
    'meta.title': 'Serion — AI活用・業務自動化・Web/システム開発',
    'meta.desc': 'Serion のポートフォリオ。Webサイト制作・Webアプリ開発・業務の自動化・WordPress/Shopify構築まで、要件定義から実装まで一貫してサポートします。技術に詳しくない方からのご相談も歓迎です。',
    skip: '本文へスキップ',
    'loader.msgs': ['読み込んでいます', 'かたちを組み立てています', '色を整えています', 'まもなく表示します'],
    'nav.top': 'Top', 'nav.topLabel': 'Serion トップページへ', 'nav.about': 'About', 'nav.services': 'Services', 'nav.work': 'Works', 'nav.contact': '新規案件 受付中',
    'clock.label': '日本の現在時刻', menu: 'メニュー',
    eyebrow: 'やさしく寄り添う、フリーランスエンジニア',
    'hero.title': 'あなたの想いを、<br /><em>丁寧に</em><br />かたちにします。',
    'hero.lead': 'つくりたいもの、効率化したい作業。まだぼんやりとしたアイデアでも大丈夫です。じっくりお話を伺い、専門用語を使わずにわかりやすくご説明しながら、一緒にかたちにしていきます。',
    'hero.status': 'ただいま新規のご相談を受け付けています',
    'hero.cta1': '無料で相談する →', 'hero.cta2': 'サービス内容を見る',
    scroll: 'SCROLL',

    'avatar.alt': 'Serion のロゴ（鶴と富士山）',
    'about.no': '01 — ABOUT', 'about.title': '「こんなこと頼めるかな？」から、<br />一緒にかたちにします。',
    'about.body': '「こういう仕組みを作りたい」「今の作業を効率化したい」。そんな抽象的なご要望からでも大丈夫です。10年以上のWeb・システム開発の経験をもとに、ビジネスの目的を丁寧に汲み取り、要件定義から実装、公開後の運用まで一貫してサポートします。技術のことがよく分からない段階での「まずは壁打ちから」というご相談も大歓迎です。',
    stat1: '年以上の開発経験', stat2: '主な開発言語（PHP / JS / Java / Python）', stat3: '% 成果を重視したご提案',

    'svc.no': '02 — SERVICES', 'svc.title': '主な対応領域',

    'values.no': '04 — VALUES', 'values.title': '「また次もお願いしたい」と<br />言っていただけることが、何よりの喜びです。',
    'values.body': 'まずは、今のお悩みや状況をお気軽にお聞かせください。一緒に整理しながら、本当に必要なことを見極め、最適な一歩をご提案します。',
    'skills.title': '対応できる技術・ツール',

    'contact.no': '05 — CONTACT', 'contact.title': '「こんなこと頼めるかな？」<br />ということでも、お気軽にどうぞ。',
    'contact.body': '技術のことがよく分からない段階からの壁打ちも大歓迎です。ご相談・お見積もりは無料、内容を確認のうえ折り返しご連絡いたします。',
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
    'hero.note': '技術の知識は必要ありません。どんな小さなご質問も、お気軽にどうぞ。',
    'why.title': '3つの安心ポイント',
    'why1.t': '丁寧なヒアリングと、わかりやすいご提案',
    'why1.d': '「何を自動化したいか」「どんなお客様に何を伝えたいか」といったビジネスの目的をしっかり汲み取ります。難しい技術の話もわかりやすい言葉に置き換えたうえで、最適な方法をご提案します。',
    'why2.t': '目的とご予算に合わせた、柔軟な開発',
    'why2.d': 'Python・PHPによる堅実なバックエンドから、Next.jsでつくる高速なWebサイト、ご自身で更新しやすいWordPress・Shopifyの構築まで。用途に合わせて、最適な技術でかたちにします。',
    'why3.t': 'フリーランスならではのフットワークの軽さ',
    'why3.d': 'すばやいレスポンスと柔軟なコミュニケーションを心がけています。スケジュールやご要望の変化にも、臨機応変に対応します。',
    'svc.lead': '要件定義から実装・公開後の運用まで、一貫してサポートします。',
    'svc.g1': 'Web・システム開発', 'svc.g2': '業務効率化・自動化・AI活用',
    'sv1.t': '新規Webサイト制作', 'sv1.d': 'ホームページやLPを、成果（コンバージョン）を重視したモダンなデザインで制作します。',
    'sv2.t': 'Webアプリケーション開発', 'sv2.d': '業務やサービスの内容に合わせたWebアプリを、要件定義から開発します。',
    'sv3.t': 'API連携・システム連携', 'sv3.d': '外部サービスや今お使いのシステムをつなぎ、データのやり取りを自動化します。',
    'sv4.t': '既存システムの保守・機能追加', 'sv4.d': '今の環境を活かしながら、改善や機能追加を行います。',
    'sv12.t': 'Webサイトのリニューアル', 'sv12.d': '古くなったサイトを、見やすく・更新しやすく・成果につながるデザインと構成に一新します。',
    'sv5.t': 'デザイン制作', 'sv5.d': 'Figma・Photoshop・Illustrator で、Webデザイン・UI設計・バナーなどを制作します。',
    'sv6.t': '業務プロセスの自動化', 'sv6.d': '受付・集計・転記・通知など、毎日の定型業務を仕組み化し、手作業とミスを減らします。',
    'sv7.t': '予約・顧客管理システム', 'sv7.d': 'Web予約の受付から顧客情報の管理、リマインド連絡まで、お店や事業に合わせて構築します。',
    'sv8.t': 'LINE公式アカウントの活用・連携', 'sv8.d': '予約・お問い合わせ・お知らせ配信などをLINEと連携し、お客様とのやり取りをスムーズにします。',
    'sv9.t': 'データ集計・レポートの自動化', 'sv9.d': '売上や問い合わせなど散らばったデータをまとめ、レポート作成までを自動化します。',
    'sv10.t': 'ペーパーレス化・業務のデジタル化', 'sv10.d': '紙やExcelで管理している業務を、クラウドで共有・管理できる形に置き換えます。',
    'sv11.t': 'AI活用・導入支援', 'sv11.d': 'チャットボットや文書の自動処理など、業務に合ったAIの活かし方をご提案し、導入までサポートします。',
    'shape.show': '{label}を表示',
    shapes: {
      crane: ['鶴', '技術で、より高く、より遠くへ'],
      heart: ['真心', 'ひとつひとつ、心を込めて'], webdev: ['Web開発', 'つながる仕組みを、ひとつに'],
      sysdev: ['システム開発', '安心して使える仕組みを、手のひらに'], design: ['デザイン', 'まずは鉛筆で、アイデアをかたちに'], system: ['システム連携', '今ある仕組みに、安全につなぐ'],
    },
  },
  en: {
    'meta.title': 'Serion — AI Adoption, Automation & Web Development',
    'meta.desc': 'Serion builds websites, web apps, automations, and WordPress or Shopify stores, from requirements to launch. No tech background needed to get started.',
    skip: 'Skip to main content',
    'loader.msgs': ['Getting ready', 'Building shapes', 'Adding color', 'Almost there'],
    'nav.top': 'Home', 'nav.topLabel': 'Serion home', 'nav.about': 'About', 'nav.services': 'Services', 'nav.work': 'Work', 'nav.contact': 'Open for work',
    'clock.label': 'Current time in Japan', menu: 'Menu',
    eyebrow: 'YOUR FRIENDLY TECH PARTNER',
    'hero.title': 'Your idea,<br />built with <em>care</em>.',
    'hero.lead': "Whether it's something you'd like to build or a task you want off your plate, a rough idea is all you need. I'll listen, explain everything in plain English, and build it with you, step by step.",
    'hero.status': 'Currently taking on new projects',
    'hero.cta1': "Let's talk →", 'hero.cta2': 'View services',
    scroll: 'SCROLL',

    'avatar.alt': 'Serion logo: a crane and Mt. Fuji',
    'about.no': '01 — ABOUT', 'about.title': 'Start with an idea.<br />We\'ll shape it together.',
    'about.body': "\"I want a system that does this.\" \"I'm tired of doing this by hand.\" A rough idea is all you need to get started. With 10+ years in web and systems development, I take the time to understand your business goals, then handle everything from requirements to launch and beyond. Not sure where to begin? I'm happy to just brainstorm with you first.",
    stat1: '+ years in development', stat2: 'core languages (PHP / JS / Java / Python)', stat3: '% focused on results',

    'svc.no': '02 — SERVICES', 'svc.title': 'What I can help with',

    'values.no': '04 — VALUES', 'values.title': 'Nothing beats hearing,<br />"Let\'s work together again."',
    'values.body': "Tell me where things stand and what's getting in the way. Together, we'll figure out what you actually need right now and find the best first step.",
    'skills.title': 'Tools & tech',

    'contact.no': '05 — CONTACT', 'contact.title': 'Not sure if I can help?<br />Just ask.',
    'contact.body': "Even if you're not sure what you need yet, I'm happy to brainstorm. Consultations and quotes are always free, and I'll get back to you soon.",
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
    'hero.note': 'No tech knowledge needed, and no question is too small.',
    'why.title': 'Why work with me',
    'why1.t': 'Careful listening, clear proposals',
    'why1.d': "I take the time to understand your goals, like what you want to automate and who you're trying to reach. Then I explain the options in plain English and recommend the best fit.",
    'why2.t': 'Flexible builds for your goals and budget',
    'why2.d': 'From solid Python and PHP back ends to fast Next.js sites and easy-to-update WordPress or Shopify stores, I pick the right tools for the job.',
    'why3.t': 'Fast, flexible, and easy to work with',
    'why3.d': "As a freelancer, I respond quickly and adapt easily when your schedule or requirements change.",
    'svc.lead': "From requirements to launch and beyond, I'll support you every step of the way.",
    'svc.g1': 'Web & System Development', 'svc.g2': 'Automation & AI',
    'sv1.t': 'New websites & landing pages', 'sv1.d': 'Modern, easy-to-use sites designed to turn visitors into customers.',
    'sv2.t': 'Web applications', 'sv2.d': 'Custom web apps built around your business, from requirements to launch.',
    'sv3.t': 'API & system integrations', 'sv3.d': 'Connecting your tools and services so data flows between them automatically.',
    'sv4.t': 'Maintenance & upgrades', 'sv4.d': 'Improving and extending the systems you already have.',
    'sv12.t': 'Website redesigns', 'sv12.d': 'Refreshing outdated sites with a modern look, easier updates, and a layout built to convert.',
    'sv5.t': 'Design', 'sv5.d': 'Web design, UI, banners, and graphics in Figma, Photoshop, and Illustrator.',
    'sv6.t': 'Business process automation', 'sv6.d': 'Turning routine work like intake, data entry, and notifications into automated workflows, with less manual effort and fewer errors.',
    'sv7.t': 'Booking & customer management', 'sv7.d': 'Online booking, customer records, and appointment reminders, set up to fit the way your business runs.',
    'sv8.t': 'LINE Official Account integration', 'sv8.d': 'Connecting bookings, inquiries, and announcements to LINE, so customers can reach you on the app they already use.',
    'sv9.t': 'Data & reporting automation', 'sv9.d': 'Pulling scattered data like sales and inquiries into one place and generating reports automatically.',
    'sv10.t': 'Going paperless', 'sv10.d': 'Moving work tracked on paper or in spreadsheets into shared, cloud-based tools.',
    'sv11.t': 'AI adoption', 'sv11.d': 'Recommending practical ways to use AI, from chatbots to automated document handling, and helping you roll them out.',
    'shape.show': 'Show {label}',
    shapes: {
      crane: ['CRANE', 'Technology that takes you further'],
      heart: ['WITH HEART', 'Care in every detail'], webdev: ['WEB DEV', 'Everything connected, built as one'],
      sysdev: ['SYSTEM DEV', 'Reliable systems, right in your hands'], design: ['DESIGN', 'Every great site starts as a sketch'], system: ['INTEGRATE', 'Secure connections to the systems you have'],
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
