import hero1_768 from '~/assets/generated/home/hero-bg-768.webp'
import hero1_1440 from '~/assets/generated/home/hero-bg-1440.webp'
import hero1_2560 from '~/assets/generated/home/hero-bg-2560.webp'
import hero2_768 from '~/assets/generated/home/hero-bg-2-768.webp'
import hero2_1440 from '~/assets/generated/home/hero-bg-2-1440.webp'
import hero2_2880 from '~/assets/generated/home/hero-bg-2-2880.webp'
import hero3_768 from '~/assets/generated/home/hero-banner-4-768.webp'
import hero3_1440 from '~/assets/generated/home/hero-banner-4-1440.webp'
import hero3_2560 from '~/assets/generated/home/hero-banner-4-2560.webp'
import hero3_4096 from '~/assets/generated/home/hero-banner-4-4096.webp'
import meetPeople480 from '~/assets/generated/home/meet-people-480.webp'
import meetPeople960 from '~/assets/generated/home/meet-people-960.webp'
import meetPeople1200 from '~/assets/generated/home/meet-people-1200.webp'
import meetStories480 from '~/assets/generated/home/meet-stories-480.webp'
import meetStories960 from '~/assets/generated/home/meet-stories-960.webp'
import meetYourself480 from '~/assets/generated/home/meet-yourself-480.webp'
import meetYourself794 from '~/assets/generated/home/meet-yourself-794.webp'
import step1_300 from '~/assets/generated/home/step1-300.webp'
import step1_486 from '~/assets/generated/home/step1-486.webp'
import step2_300 from '~/assets/generated/home/step2-300.webp'
import step2_486 from '~/assets/generated/home/step2-486.webp'
import step3_300 from '~/assets/generated/home/step3-300.webp'
import step3_486 from '~/assets/generated/home/step3-486.webp'
import step4_300 from '~/assets/generated/home/step4-300.webp'
import step4_594 from '~/assets/generated/home/step4-594.webp'
import step5_300 from '~/assets/generated/home/step5-300.webp'
import step5_594 from '~/assets/generated/home/step5-594.webp'
import exploreXian600 from '~/assets/generated/home/explore-xian-600.webp'
import exploreXian1200 from '~/assets/generated/home/explore-xian-1200.webp'
import exploreChengdu600 from '~/assets/generated/home/explore-chengdu-600.webp'
import exploreChengdu1200 from '~/assets/generated/home/explore-chengdu-1200.webp'
import exploreBeijing600 from '~/assets/generated/home/explore-beijing-600.webp'
import exploreBeijing736 from '~/assets/generated/home/explore-beijing-736.webp'
import explorersWall700 from '~/assets/generated/home/explorers-wall-700.webp'
import explorersWall1402 from '~/assets/generated/home/explorers-wall-1402.webp'

const srcset = (...sources: Array<[string, number]>) => sources.map(([source, width]) => `${source} ${width}w`).join(', ')

export const heroSlides = [
  {
    id: 'hero-1',
    index: 0,
    fallback: '/images/home/hero-bg.png',
    width: 2560,
    height: 1440,
    mobileWebpSrcset: srcset([hero1_768, 768]),
    webpSrcset: srcset([hero1_768, 768], [hero1_1440, 1440]),
    wideWebpSrcset: srcset([hero1_1440, 1440], [hero1_2560, 2560]),
  },
  {
    id: 'hero-2',
    index: 1,
    fallback: '/images/home/hero-bg-2.png',
    width: 2880,
    height: 1640,
    mobileWebpSrcset: srcset([hero2_768, 768]),
    webpSrcset: srcset([hero2_768, 768], [hero2_1440, 1440]),
    wideWebpSrcset: srcset([hero2_1440, 1440], [hero2_2880, 2880]),
  },
  {
    id: 'hero-3',
    index: 2,
    fallback: '/images/home/hero-banner-4.png',
    width: 4096,
    height: 2304,
    mobileWebpSrcset: srcset([hero3_768, 768]),
    webpSrcset: srcset([hero3_768, 768], [hero3_1440, 1440]),
    wideWebpSrcset: srcset([hero3_1440, 1440], [hero3_2560, 2560], [hero3_4096, 4096]),
  },
] as const

export const heroPreload = hero1_1440
export const meetPeopleSrcset = srcset([meetPeople480, 480], [meetPeople960, 960], [meetPeople1200, 1200])
export const meetStoriesSrcset = srcset([meetStories480, 480], [meetStories960, 960])
export const meetYourselfSrcset = srcset([meetYourself480, 480], [meetYourself794, 794])
export const step1Srcset = srcset([step1_300, 300], [step1_486, 486])
export const step2Srcset = srcset([step2_300, 300], [step2_486, 486])
export const step3Srcset = srcset([step3_300, 300], [step3_486, 486])
export const step4Srcset = srcset([step4_300, 300], [step4_594, 594])
export const step5Srcset = srcset([step5_300, 300], [step5_594, 594])
export const exploreXianSrcset = srcset([exploreXian600, 600], [exploreXian1200, 1200])
export const exploreChengduSrcset = srcset([exploreChengdu600, 600], [exploreChengdu1200, 1200])
export const exploreBeijingSrcset = srcset([exploreBeijing600, 600], [exploreBeijing736, 736])
export const explorersWallSrcset = srcset([explorersWall700, 700], [explorersWall1402, 1402])
