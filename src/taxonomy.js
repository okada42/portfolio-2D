// Classification used by the Works page. Keys are what you write in data/works.csv.
// Order here = display order. Labels are shown in the current language.

export const SERVICES = [
  { key: 'web', ja: 'Web開発', en: 'Web Development', icon: 'web' },
  { key: 'system', ja: 'システム導入', en: 'Business Systems', icon: 'system' },
  { key: 'game', ja: 'ゲーム開発', en: 'Games', icon: 'game' },
  { key: 'mobile', ja: 'モバイルアプリ開発', en: 'Mobile Apps', icon: 'mobile' },
];

export const INDUSTRIES = [
  { key: 'medical', ja: '医療・クリニック', en: 'Medical & Clinics' },
  { key: 'welfare', ja: '福祉・介護', en: 'Welfare & Care' },
  { key: 'beauty', ja: '美容・サロン', en: 'Beauty & Wellness' },
  { key: 'food', ja: '飲食', en: 'Food & Restaurants' },
  { key: 'realestate', ja: '不動産', en: 'Real Estate' },
  { key: 'construction', ja: '建設・住宅', en: 'Construction & Housing' },
  { key: 'manufacturing', ja: '製造業', en: 'Manufacturing' },
  { key: 'retail', ja: '小売・EC', en: 'Retail & E-commerce' },
  { key: 'education', ja: '教育・スクール', en: 'Education' },
  { key: 'professional', ja: '士業・コンサルティング', en: 'Professional Services' },
  { key: 'it', ja: 'IT・Webサービス', en: 'Tech & Software' },
  { key: 'hospitality', ja: '観光・宿泊', en: 'Travel & Hospitality' },
  { key: 'logistics', ja: '物流・運輸', en: 'Logistics & Transportation' },
  { key: 'staffing', ja: '人材・採用', en: 'Staffing & Recruiting' },
  { key: 'entertainment', ja: 'エンタメ・ゲーム', en: 'Entertainment & Games' },
  { key: 'public', ja: '自治体・団体', en: 'Government & Nonprofits' },
  { key: 'personal', ja: '個人・クリエイター', en: 'Individuals & Creators' },
  { key: 'other', ja: 'その他', en: 'Other' },
];

// Only used for Web Development projects.
export const SITE_TYPES = [
  { key: 'hp', ja: 'ホームページ（HP）', en: 'Website' },
  { key: 'corporate', ja: 'コーポレートサイト', en: 'Corporate site' },
  { key: 'lp', ja: 'ランディングページ', en: 'Landing page' },
  { key: 'ec', ja: 'ECサイト', en: 'Online store' },
  { key: 'booking', ja: '予約サイト', en: 'Booking & reservations' },
  { key: 'media', ja: 'オウンドメディア・ブログ', en: 'Blog & media' },
  { key: 'recruit', ja: '採用サイト', en: 'Careers site' },
  { key: 'portal', ja: 'ポータル・会員サイト', en: 'Portal & membership' },
];

// Skills filter: two groups. Every skill listed here is always shown in the filter (greyed out until a
// project uses it). Skills used in works.csv but not listed here go into "Coding" automatically,
// so add new no-code tools to the second list.
export const SKILL_GROUPS = [
  {
    key: 'code', ja: 'プログラミング', en: 'Coding',
    skills: ['PHP', 'Python', 'JavaScript', 'TypeScript', 'Java', 'Laravel', 'React', 'Next.js', 'Vue.js', 'Node.js',
      'MySQL', 'Firebase', 'Google Apps Script', 'LLM / AI API', 'LINE API', 'Zoom API', 'three.js', 'Canvas'],
  },
  {
    key: 'nocode', ja: 'ノーコード・デザインツール', en: 'No-code & design tools',
    skills: [
      // CMS & site builders
      'WordPress', 'WooCommerce', 'Shopify', 'Wix', 'STUDIO',
      // hosting & operations
      'Server migration', 'Domain setup',
      // marketing
      'SEO / MEO', 'Multilingual',
      // business & automation
      'kintone', 'Zapier', 'Make', 'Notion', 'Google Workspace', 'Excel / CSV',
      // design
      'Figma', 'Photoshop', 'Illustrator', 'Adobe XD', 'Canva', 'Premiere Pro',
    ],
  },
];

// Search shortcuts: typing the key also finds the values.
export const SEARCH_SYNONYMS = {
  wp: ['wordpress', 'ワードプレス'], 'ワードプレス': ['wordpress'],
  js: ['javascript'], ts: ['typescript'], gas: ['google apps script'],
  hp: ['ホームページ', 'website'], 'ホームページ': ['hp', 'website'], website: ['ホームページ', 'hp'],
  lp: ['ランディングページ', 'landing page'], 'ランディングページ': ['lp'],
  ec: ['ecサイト', 'e-commerce', 'online store', 'ネットショップ'], 'ネットショップ': ['ec', 'online store'], store: ['ecサイト', 'online store'], shop: ['ecサイト', 'online store'],
  ai: ['ai', 'llm'], 'エーアイ': ['ai'],
  line: ['line公式', 'ライン', 'line api'], 'ライン': ['line', 'line api'], zoom: ['zoom api'], 'ズーム': ['zoom api'], 'オンライン診療': ['zoom api', 'オンライン相談'], '連携': ['api', 'integration'], '整形外科': ['medical', 'clinic'],
  'ドメイン': ['domain setup', 'server migration'], 'スタジオ': ['studio'],
  '音楽': ['music'], 'ジャズ': ['jazz'], '教室': ['school', 'スクール'], 'スクール': ['school', '教室'],
  seo: ['seo / meo'], meo: ['seo / meo'], 'エスイーオー': ['seo / meo'], '集客': ['seo / meo'], '福祉': ['welfare'], 'グループホーム': ['welfare', 'group home'], '障がい': ['障害'], '障害': ['障がい'],
  '採用': ['recruit', 'careers'], '求人': ['recruit', 'careers'], 'リクルート': ['recruit'], 'スパ': ['spa'], 'リラクゼーション': ['relaxation'],
  'エステ': ['esthe', 'beauty'], '脱毛': ['hair removal', 'wax'],
  'リフォーム': ['renovation', 'リノベーション'], 'リノベーション': ['renovation', 'リフォーム'], 'リノベ': ['renovation', 'リノベーション'], '工務店': ['construction'], '注文住宅': ['custom home', '工務店'], '住宅': ['housing', 'home'], 'パッシブハウス': ['passive house'], '鳥取': ['tottori'], 'モルタル': ['mortar'],
  'カフェ': ['cafe', 'café'], '飲食店': ['food', 'restaurant'], '多言語': ['multilingual', 'インバウンド'], 'インバウンド': ['multilingual', '多言語'], '英語': ['multilingual'], 'ギフト': ['gift'], 'ヘアケア': ['hair care', 'shampoo'], 'レザー': ['leather'], '革': ['leather'], '財布': ['wallet', 'leather'], 'ブログ': ['blog', 'media'], 'ニュース': ['news', 'blog'], 'シャンプー': ['shampoo', 'hair care'], 'コスメ': ['cosmetics', 'skincare'], 'スキンケア': ['skincare', 'cosmetics'], 'ドクターズコスメ': ['skincare', 'doctor'], '美容液': ['skincare'], '化粧品': ['cosmetics'], 'ネット販売': ['ec', 'online store'], 'd2c': ['online store', 'ecサイト'], 'アイス': ['gelato', 'ice cream'], 'ジェラート': ['gelato'], 'ショッピファイ': ['shopify'],
  'サーバー移転': ['server migration'], '移転': ['server migration'], 'ドメイン移管': ['server migration'], '静的': ['静的サイト', 'static'], static: ['静的'],
  'エクセル': ['excel'], 'フィグマ': ['figma'], 'フォトショップ': ['photoshop'], 'イラストレーター': ['illustrator'],
};

export const keysOf = (list) => list.map((x) => x.key);
