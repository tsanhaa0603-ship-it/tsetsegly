/**
 * Цүнх болон стикерийн загварыг хэвлэлийн үйлдвэрт өгөх PDF болгон хөрвүүлнэ.
 *
 * Ажиллуулах:
 *   node scripts/build-print-pdfs.mjs
 *
 * Гаралт: print/tsetsegly-tsunh.pdf, print/tsetsegly-sticker.pdf
 *
 * Playwright-г төслийн node_modules-оос, эсвэл глобал суулгацаас олно.
 */
import { createRequire } from 'node:module'
import { execSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const require = createRequire(import.meta.url)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const PAGES = [
  { src: 'public/bag-design.html', out: 'print/tsetsegly-tsunh.pdf', title: 'Баглааны цүнх' },
  { src: 'public/stickers.html', out: 'print/tsetsegly-sticker.pdf', title: 'Стикер' },
]

function loadPlaywright() {
  try {
    return require('playwright')
  } catch {
    const globalRoot = execSync('npm root -g', { encoding: 'utf8' }).trim()
    return require(resolve(globalRoot, 'playwright'))
  }
}

const { chromium } = loadPlaywright()

const browser = await chromium.launch()
const page = await browser.newPage()

mkdirSync(resolve(root, 'print'), { recursive: true })

for (const { src, out, title } of PAGES) {
  await page.goto(pathToFileURL(resolve(root, src)).href, { waitUntil: 'networkidle' })
  // Google Fonts бүрэн ачаалж дуустал хүлээнэ — эс бөгөөс PDF дээр
  // Cinzel / Playfair / Caveat биш, системийн serif фонтоор гарна.
  await page.evaluate(() => document.fonts.ready)
  await page.emulateMedia({ media: 'print' })
  await page.pdf({
    path: resolve(root, out),
    preferCSSPageSize: true, // HTML доторх @page{size:A4; margin:12mm} -г мөрдөнө
    printBackground: true,
    tagged: true,
  })
  console.log(`✓ ${title.padEnd(16)} ${out}`)
}

await browser.close()
