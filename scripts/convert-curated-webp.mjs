import sharp from 'sharp'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dir = resolve(__dirname, '../public/images/home-v2')

const files = [
  'encounter-beijing-582',
  'encounter-chengdu-582',
  'encounter-xian-582'
]

for (const name of files) {
  const input = resolve(dir, `${name}.png`)
  const output = resolve(dir, `${name}.webp`)
  await sharp(input)
    .webp({ quality: 95, effort: 6 })
    .toFile(output)
  console.log(`Converted ${name}.png -> ${name}.webp`)
}
