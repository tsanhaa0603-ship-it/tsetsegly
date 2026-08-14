/**
 * Google Fonts-оос шаардлагатай фонтуудыг татаж public/fonts/ дотор хадгална.
 *
 * Ажиллуулах:
 *   node scripts/fetch-fonts.mjs
 *
 * Яагаад локал болгов:
 *  · Хэвлэлийн PDF нь сүлжээнээс хамаарахгүй, үргэлж ижил гарна.
 *  · Кирилл (Ө, Ү) үсэг cyrillic-ext дэд олонлогт байдаг тул түүнийг заавал татна.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'public/fonts')

// bag-design.html болон stickers.html хоёрын хэрэглэдэг бүх жин/налууг нэгтгэсэн.
const CSS_URL =
  'https://fonts.googleapis.com/css2' +
  '?family=Caveat:wght@500;600;700' +
  '&family=Cinzel:wght@400;500;600' +
  '&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500' +
  '&family=Playfair+Display:ital,wght@0,500;0,600;1,400;1,500;1,600' +
  '&display=swap'

// Санаатайгаар хуучин хөтчийн UA. Орчин үеийн UA-д Google нь variable фонт өгдөг ба
// Chromium түүнийг PDF дотор Type 3 фонт болгон суулгадаг — зарим хэвлэлийн RIP татгалздаг.
// Хуучин UA нь жин тус бүрээр static woff2 өгдөг тул PDF дотор CID TrueType болж суудаг.
const UA =
  'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36'

mkdirSync(outDir, { recursive: true })

const get = (url) => fetch(url, { headers: { 'User-Agent': UA } })

/** Нэг CSS хариултыг бүхэлд нь татаж үзнэ. Аль нэг URL нурвал бүхэлд нь дахин оролдоно. */
async function downloadOnce() {
  const res = await get(CSS_URL)
  if (!res.ok) throw new Error(`Google Fonts CSS → ${res.status}`)
  const css = await res.text()

  const urls = [...new Set([...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g)].map((m) => m[1]))]
  if (!urls.length) throw new Error('CSS дотор woff2 холбоос олдсонгүй')

  const files = new Map()
  for (const url of urls) {
    // Файл бүр нэг гэр бүл + жин + налуу + дэд олонлогийг төлөөлнө.
    const block = css.slice(0, css.indexOf(url))
    const family = block.match(/font-family:\s*'([^']+)'(?![\s\S]*font-family)/)?.[1] ?? 'font'
    const weight = block.match(/font-weight:\s*(\d+)(?![\s\S]*font-weight)/)?.[1] ?? '400'
    const style = block.match(/font-style:\s*(\w+)(?![\s\S]*font-style)/)?.[1] ?? 'normal'
    const subset = block.match(/\/\* ([a-z-]+) \*\/(?![\s\S]*\/\* [a-z-]+ \*\/)/)?.[1] ?? 'latin'
    const name = `${family.replace(/\s+/g, '')}-${weight}${style === 'italic' ? 'i' : ''}-${subset}.woff2`

    const font = await get(url)
    if (!font.ok) throw new Error(`${name} → ${font.status}`)
    files.set(url, { name, data: Buffer.from(await font.arrayBuffer()) })
  }
  return { css, files }
}

// Google заримдаа хүчингүй (404) woff2 холбоостой CSS буцаадаг — дахин асуувал зөв нь ирдэг.
let result
for (let attempt = 1; ; attempt++) {
  try {
    result = await downloadOnce()
    break
  } catch (err) {
    if (attempt === 4) throw err
    console.log(`  ! ${err.message} — дахин оролдож байна (${attempt}/3)`)
    await new Promise((r) => setTimeout(r, attempt * 1000))
  }
}

// Бүх файл амжилттай татагдсаны дараа л дискэнд бичнэ — хагас гаралт үлдээхгүй.
for (const { name, data } of result.files.values()) {
  writeFileSync(resolve(outDir, name), data)
  console.log(`  ↓ ${name} (${(data.byteLength / 1024).toFixed(1)} KB)`)
}

const local = [...result.files].reduce(
  (acc, [url, { name }]) => acc.split(url).join(name),
  `/* Автоматаар үүсгэсэн — scripts/fetch-fonts.mjs. Гараар засахгүй. */\n${result.css}`,
)

// √ ≈ ✓ ✗ дөрвөн тэмдэгт Cormorant Garamond-д байхгүй — scripts/build-symbol-font.py үзнэ үү.
const symbols = `
/* symbols — scripts/build-symbol-font.py */
@font-face {
  font-family: 'Tsetsegly Symbols';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(TsetseglySymbols.woff2) format('woff2');
  unicode-range: U+221A, U+2248, U+2713, U+2717;
}
`

writeFileSync(resolve(outDir, 'fonts.css'), local + symbols)
console.log(`\n✓ ${result.files.size} фонт файл + fonts.css → public/fonts/`)
