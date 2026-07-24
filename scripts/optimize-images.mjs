import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const webpGroups = [
  { source: 'public/images/auth/hero-auth-aurora.jpg', output: 'app/assets/generated/auth/hero-auth-aurora', widths: [1080], quality: 92 },
  { source: 'public/images/home/hero-bg.png', output: 'app/assets/generated/home/hero-bg', widths: [768, 1440, 2560], quality: 92 },
  { source: 'public/images/home/hero-bg-2.png', output: 'app/assets/generated/home/hero-bg-2', widths: [768, 1440, 2880], quality: 92 },
  { source: 'public/images/home/hero-banner-4.png', output: 'app/assets/generated/home/hero-banner-4', widths: [768, 1440, 2560, 4096], quality: 92 },
  { source: 'public/images/home/meet-people.png', output: 'app/assets/generated/home/meet-people', widths: [480, 960, 1200], quality: 86 },
  { source: 'public/images/home/meet-stories.png', output: 'app/assets/generated/home/meet-stories', widths: [480, 960], quality: 86 },
  { source: 'public/images/home/meet-yourself.png', output: 'app/assets/generated/home/meet-yourself', widths: [480, 794], quality: 86 },
  { source: 'public/images/home/step1.png', output: 'app/assets/generated/home/step1', widths: [300, 486], quality: 86 },
  { source: 'public/images/home/step2.png', output: 'app/assets/generated/home/step2', widths: [300, 486], quality: 86 },
  { source: 'public/images/home/step3.png', output: 'app/assets/generated/home/step3', widths: [300, 486], quality: 86 },
  { source: 'public/images/home/step4.png', output: 'app/assets/generated/home/step4', widths: [300, 594], quality: 86 },
  { source: 'public/images/home/step5.png', output: 'app/assets/generated/home/step5', widths: [300, 594], quality: 86 },
  { source: 'public/images/home/explore-xian.png', output: 'app/assets/generated/home/explore-xian', widths: [600, 1200], quality: 86 },
  { source: 'public/images/home/explore-chengdu.png', output: 'app/assets/generated/home/explore-chengdu', widths: [600, 1200], quality: 86 },
  { source: 'public/images/home/explore-beijing.png', output: 'app/assets/generated/home/explore-beijing', widths: [600, 736], quality: 86 },
  { source: 'public/images/home/explorers-wall.png', output: 'app/assets/generated/home/explorers-wall', widths: [700, 1402], quality: 86 },
]

for (const group of webpGroups) {
  const source = resolve(root, group.source)
  for (const width of group.widths) {
    const output = resolve(root, `${group.output}-${width}.webp`)
    await mkdir(dirname(output), { recursive: true })
    await sharp(source)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: group.quality, effort: 6, smartSubsample: true })
      .toFile(output)
  }
}

const licenseOutput = resolve(root, 'app/assets/generated/common/yyzz-48.png')
await mkdir(dirname(licenseOutput), { recursive: true })
await sharp(resolve(root, 'public/images/common/yyzz.png'))
  .resize(48, 48, { fit: 'cover' })
  .png({ compressionLevel: 9, palette: true })
  .toFile(licenseOutput)

console.log(`Generated ${webpGroups.reduce((total, group) => total + group.widths.length, 0) + 1} optimized image assets.`)
