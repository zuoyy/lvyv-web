export interface EncounterProduct {
  code: string
  slug: string
  title: string
  city: 'Beijing' | "Xi'an"
  duration: string
  image: string
  kind: 'route' | 'experience'
  ready: boolean
}

export const healthCheckupProductCode = 'ENC-BJ-BASIC-HEALTH-CHECKUP'

export const encounterProducts: EncounterProduct[] = [
  { code: 'ENC-BJ-CHINA-RITUAL', slug: 'beijing-china-ritual', title: 'The China Ritual', city: 'Beijing', duration: '3 days · 2 nights', image: 'great-wall', kind: 'route', ready: true },
  { code: 'ENC-BJ-WRIST-TCM-DAY', slug: 'beijing-wrist-tcm-day', title: 'The Doctor Who Reads Your Wrist', city: 'Beijing', duration: '1 day', image: 'beijing-pulse-diagnosis', kind: 'route', ready: true },
  { code: 'ENC-BJ-NEW-FACE-SAME-DAY', slug: 'beijing-new-face-same-day', title: 'New Face, Same Day', city: 'Beijing', duration: '1 day', image: 'temple-of-heaven', kind: 'route', ready: true },
  { code: 'ENC-BJ-DENTAL-CLEANING', slug: 'beijing-dental-cleaning', title: 'Dental Cleaning + Checkup', city: 'Beijing', duration: '2 hours', image: 'detail/dental-cleaning', kind: 'experience', ready: true },
  { code: 'ENC-BJ-EYE-EXAM-CUSTOM-GLASSES', slug: 'beijing-eye-exam-custom-glasses', title: 'Eye Exam + Custom Glasses', city: 'Beijing', duration: 'Half day', image: 'detail/eye-exam', kind: 'experience', ready: true },
  { code: 'ENC-BJ-TCM-PULSE-ACUPUNCTURE', slug: 'beijing-tcm-pulse-acupuncture', title: 'TCM Pulse + Acupuncture', city: 'Beijing', duration: '2 hours', image: 'detail/pulse-diagnosis', kind: 'experience', ready: true },
  { code: healthCheckupProductCode, slug: 'beijing-basic-health-checkup', title: 'Basic Health Checkup', city: 'Beijing', duration: 'Half day', image: 'health-checkup/hero', kind: 'experience', ready: true },
  { code: 'ENC-BJ-GONGFU-TEA-CEREMONY', slug: 'beijing-gongfu-tea-ceremony', title: 'Gongfu Tea Ceremony Workshop', city: 'Beijing', duration: '1.5 hours', image: 'tea/tea-room', kind: 'experience', ready: true },
  { code: 'ENC-BJ-DUMPLING-MASTER-CLASS', slug: 'beijing-dumpling-master-class', title: 'Dumpling Master Class', city: 'Beijing', duration: '2 hours', image: 'dumplings/hutong-class', kind: 'experience', ready: true },
  { code: 'ENC-BJ-TEMPLE-OF-HEAVEN-TAI-CHI', slug: 'beijing-temple-of-heaven-tai-chi', title: 'Tai Chi at Temple of Heaven', city: 'Beijing', duration: '1.5 hours · Sunrise', image: 'taichi/taichi-group', kind: 'experience', ready: true },
  { code: 'ENC-BJ-CALLIGRAPHY-INK-BRUSH', slug: 'beijing-calligraphy-ink-brush', title: 'Calligraphy & Ink Brush Workshop', city: 'Beijing', duration: '2 hours', image: 'calligraphy/calligraphy-table', kind: 'experience', ready: true },
  { code: 'ENC-XA-ANCIENT-PHARMACY', slug: 'xian-ancient-pharmacy', title: 'The 2,000-Year-Old Pharmacy', city: "Xi'an", duration: '3 days · 2 nights', image: 'terracotta-warriors', kind: 'route', ready: true },
  { code: 'ENC-XA-WRIST-PHARMACY-DAY', slug: 'xian-wrist-pharmacy-day', title: 'The Doctor Who Reads Your Wrist', city: "Xi'an", duration: '1 day', image: 'museum-terracotta', kind: 'route', ready: true },
  { code: 'ENC-XA-SILK-ROAD-FIX', slug: 'xian-silk-road-fix', title: 'The Silk Road Fix', city: "Xi'an", duration: '1 day', image: 'big-wild-goose-pagoda', kind: 'route', ready: true },
  { code: 'ENC-XA-TCM-PULSE-ACUPUNCTURE', slug: 'xian-tcm-pulse-acupuncture', title: 'TCM Pulse + Acupuncture', city: "Xi'an", duration: '2 hours', image: 'detail/pulse-diagnosis', kind: 'experience', ready: true },
  { code: 'ENC-XA-HERBAL-MARKET-WALK', slug: 'xian-herbal-market-walk', title: 'Herbal Medicine Market Walk', city: "Xi'an", duration: '2 hours', image: 'xian-experiences/herbal/apothecary', kind: 'experience', ready: true },
  { code: 'ENC-XA-DIRECT-MOXIBUSTION', slug: 'xian-direct-moxibustion', title: 'Direct Moxibustion', city: "Xi'an", duration: '1 hour', image: 'xian-experiences/moxibustion/moxa-closeup', kind: 'experience', ready: true },
  { code: 'ENC-XA-HERBAL-FOOT-SOAK-MASSAGE', slug: 'xian-herbal-foot-soak-massage', title: 'Herbal Foot Soak + Massage', city: "Xi'an", duration: '1.5 hours', image: 'xian-experiences/foot-soak/foot-soak-herbs', kind: 'experience', ready: true },
  { code: 'ENC-XA-BIANG-BIANG-NOODLES', slug: 'xian-biang-biang-noodles', title: 'Biang Biang Noodle Master Class', city: "Xi'an", duration: '1.5 hours', image: 'xian-experiences/biang-noodles/biang-sign-pull', kind: 'experience', ready: true },
  { code: 'ENC-XA-TANG-DYNASTY-TEA-RITUAL', slug: 'xian-tang-dynasty-tea-ritual', title: 'Tang Dynasty Tea Ritual', city: "Xi'an", duration: '1.5 hours', image: 'xian-experiences/tang-tea/diancha-whisked', kind: 'experience', ready: true },
  { code: 'ENC-XA-TERRACOTTA-CLAY-CRAFT', slug: 'xian-terracotta-clay-craft', title: 'Terracotta Warrior Clay Craft', city: "Xi'an", duration: '2 hours', image: 'xian-experiences/terracotta-craft/warrior-pit', kind: 'experience', ready: true },
  { code: 'ENC-XA-HANFU-CITY-WALL-WALK', slug: 'xian-hanfu-city-wall-walk', title: 'Hanfu Dress-Up + City Wall Walk', city: "Xi'an", duration: '2 hours · Sunset', image: 'xian-experiences/hanfu-wall/hanfu-red-flow', kind: 'experience', ready: true },
]

export const encounterProductPath = (product: EncounterProduct) => '/product/' + product.slug
export const encounterImage = (name: string) => '/images/encounters/wellness/' + name + '.webp'
