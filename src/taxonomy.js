// Classification used by the Works page. Keys are what you write in data/works.csv.
// Order here = display order. Labels are shown in the current language.

export const SERVICES = [
  { key: 'web', ja: 'Web開発', en: 'Web Development', icon: 'web' },
  { key: 'system', ja: 'システム導入', en: 'System Implementation', icon: 'system' },
  { key: 'game', ja: 'ゲーム開発', en: 'Game Development', icon: 'game' },
  { key: 'mobile', ja: 'モバイル開発', en: 'Mobile Development', icon: 'mobile' },
];

export const INDUSTRIES = [
  { key: 'medical', ja: '医療・クリニック', en: 'Medical & Clinics' },
  { key: 'beauty', ja: '美容・サロン', en: 'Beauty & Wellness' },
  { key: 'food', ja: '飲食', en: 'Food & Restaurants' },
  { key: 'realestate', ja: '不動産', en: 'Real Estate' },
  { key: 'construction', ja: '建設・住宅', en: 'Construction & Housing' },
  { key: 'manufacturing', ja: '製造業', en: 'Manufacturing' },
  { key: 'retail', ja: '小売・EC', en: 'Retail & E-commerce' },
  { key: 'education', ja: '教育・スクール', en: 'Education' },
  { key: 'professional', ja: '士業・専門サービス', en: 'Professional Services' },
  { key: 'it', ja: 'IT・Webサービス', en: 'IT & Tech' },
  { key: 'hospitality', ja: '観光・宿泊', en: 'Travel & Hospitality' },
  { key: 'logistics', ja: '物流・運輸', en: 'Logistics & Transport' },
  { key: 'staffing', ja: '人材・採用', en: 'Staffing & Recruitment' },
  { key: 'entertainment', ja: 'エンタメ・ゲーム', en: 'Entertainment & Games' },
  { key: 'public', ja: '公共・団体', en: 'Public & Non-profit' },
  { key: 'personal', ja: '個人・クリエイター', en: 'Personal & Creators' },
  { key: 'other', ja: 'その他', en: 'Other' },
];

// Only used for Web Development projects.
export const SITE_TYPES = [
  { key: 'corporate', ja: 'コーポレートサイト', en: 'Corporate site' },
  { key: 'lp', ja: 'ランディングページ', en: 'Landing page' },
  { key: 'ec', ja: 'ECサイト', en: 'E-commerce' },
  { key: 'booking', ja: '予約サイト', en: 'Booking / Reservation' },
  { key: 'media', ja: 'メディア・ブログ', en: 'Media / Blog' },
  { key: 'recruit', ja: '採用サイト', en: 'Recruitment' },
  { key: 'portal', ja: 'ポータル・会員サイト', en: 'Portal / Membership' },
];

export const keysOf = (list) => list.map((x) => x.key);
