#!/usr/bin/env node
/* ─────────────────────────────────────────────
   Build дараах SEO бэлтгэл

   Асуудал: React SPA учир бүх маршрут index.html-ийн
   ижил <title>, description-ыг хуваалцдаг. Google-ийн
   хувьд энэ нь "5 хуудас, 1 гарчиг" — индексжүүлэхэд саад.

   Шийдэл: маршрут бүрд өөрийн meta-тай статик HTML
   үүсгэнэ. Vercel файлын системийг rewrite-аас түрүүлж
   шалгадаг тул /ready → dist/ready/index.html очно.
   React дараа нь ердийнхөөрөө hydrate хийнэ.

   Мөн: JSON-LD (Florist схем) болон sitemap.xml-ийг
   ижил эх сурвалжаас үүсгэнэ — зөрөх боломжгүй.

   Ажиллуулах: npm run build (postbuild-аар автоматаар)
───────────────────────────────────────────── */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const SITE = 'https://tsetsegly.mn'

/* Заавал биш — тохируулсан үед л хуудсанд суулгана.
   Vercel дээр Project Settings → Environment Variables хэсэгт нэмнэ.

     GSC_VERIFICATION  Search Console-ийн баталгаажуулалтын код
     GA4_ID            Google Analytics 4 (G-XXXXXXXXXX) */
const GSC = process.env.GSC_VERIFICATION || ''
const GA4 = process.env.GA4_ID || ''

/* ── Байгууллагын мэдээлэл — GBP, /contact-тэй яг таарах ёстой ── */
const BIZ = {
  name: 'Tsetsegly',
  altName: 'Tsetsegly цэцгийн дэлгүүр',
  phone: '+976-8844-4310',
  email: 'tsanhaa0603@gmail.com',
  opens: '10:00',
  closes: '20:00',
  districts: ['Сүхбаатар', 'Чингэлтэй', 'Баянгол', 'Хан-Уул', 'Баянзүрх', 'Сонгинохайрхан'],
  social: [
    'https://www.facebook.com/people/Tsetsegly-flower-shop/61578490586768/',
    'https://www.instagram.com/tsetsegly.shop',
  ],
}

/* ── Маршрут бүрийн meta ──
   title 60 тэмдэгт орчим, description 150–160 тэмдэгт орчим байвал
   Google хайлтын үр дүнд тасрахгүй бүтнээр харагдана. */
const ROUTES = [
  {
    path: '/',
    file: 'index.html',
    priority: '1.0',
    changefreq: 'weekly',
    title: 'Tsetsegly — Захиалгат цэцгийн дэлгүүр | Цэцэг хүргэлт Улаанбаатар',
    description:
      'Цэцэг, боолт, хэлбэрээ өөрөө сонгож баглаагаа зохионо. Улаанбаатар даяар хүргэлт ₮10,000, ₮150,000-аас дээш захиалгад үнэгүй. Утас 8844-4310.',
  },
  {
    path: '/ready',
    file: 'ready/index.html',
    priority: '0.9',
    changefreq: 'weekly',
    title: 'Бэлэн цэцгийн баглаа — үнэ, зураг | Tsetsegly',
    description:
      'Гар хийцийн бэлэн баглаанууд: сарнай, башир, лили, барын чих. Сонгоод шууд захиалаарай. Улаанбаатарт ижил өдөртөө хүргэнэ.',
  },
  {
    path: '/build',
    file: 'build/index.html',
    priority: '0.9',
    changefreq: 'weekly',
    title: 'Цэцгийн баглаа өөрөө зохиох | Tsetsegly',
    description:
      '15 төрлийн цэцэг, 25 боолтын цаас, 6 хэлбэрээс сонгож өөрийн баглаагаа зохионо. QR-аар нээгддэг хувийн захидлын хуудас дагалдана.',
  },
  {
    path: '/about',
    file: 'about/index.html',
    priority: '0.7',
    changefreq: 'monthly',
    title: 'Бидний тухай | Tsetsegly захиалгат цэцгийн дэлгүүр',
    description:
      'Tsetsegly бол Улаанбаатарын захиалгат цэцгийн дэлгүүр. Баглаа бүрийг захиалга ирсний дараа гараар бэлтгэдэг — тавиур дээр зогссон баглаа байхгүй.',
  },
  {
    path: '/contact',
    file: 'contact/index.html',
    priority: '0.6',
    changefreq: 'monthly',
    title: 'Холбоо барих, хүргэлтийн бүс | Tsetsegly',
    description:
      'Утас 8844-4310, ажлын цаг 10:00–20:00. Улаанбаатарын 6 дүүрэгт хүргэнэ, төлбөр ₮10,000. Салбар дэлгүүргүй — зөвхөн хүргэлт.',
  },
]

/* ── JSON-LD: Florist схем ──
   Гудамжны хаяг байхгүй (салбар дэлгүүргүй), оронд нь areaServed. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Florist',
  '@id': SITE + '/#business',
  name: BIZ.name,
  alternateName: BIZ.altName,
  url: SITE + '/',
  image: SITE + '/logo.png',
  logo: SITE + '/logo.png',
  telephone: BIZ.phone,
  email: BIZ.email,
  priceRange: '₮15,000–₮250,000',
  currenciesAccepted: 'MNT',
  paymentAccepted: 'QPay, Бэлэн мөнгө, Дансаар',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Улаанбаатар',
    addressCountry: 'MN',
  },
  areaServed: BIZ.districts.map((d) => ({
    '@type': 'AdministrativeArea',
    name: d + ' дүүрэг, Улаанбаатар',
  })),
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: BIZ.opens,
      closes: BIZ.closes,
    },
  ],
  sameAs: BIZ.social,
}

/* ── Бэлэн баглааны хуудсууд ──
   Build үед API-аас татаж, баглаа бүрд өөрийн хаяг, meta,
   Product схемтэй хуудас үүсгэнэ. Урт сүүлтэй хайлтын гол эх үүсвэр.
   API унтарсан бол алгасна — build унахгүй. */
const API = (process.env.VITE_API_URL || 'https://tsetsegly-api.vercel.app').replace(/\/$/, '')

async function fetchBouquets() {
  try {
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 15000)
    const res = await fetch(`${API}/api/ready`, { signal: ctrl.signal })
    clearTimeout(t)
    if (!res.ok) return { list: [], note: `API HTTP ${res.status}` }
    const list = await res.json()
    if (!Array.isArray(list)) return { list: [], note: 'API буруу хариу' }
    const withSlug = list.filter((b) => b.slug)
    const note =
      withSlug.length < list.length ? `${list.length - withSlug.length} баглаа slug-гүй` : ''
    return { list: withSlug, note }
  } catch (e) {
    return { list: [], note: e.name === 'AbortError' ? 'API хугацаа хэтэрлээ' : 'API холбогдсонгүй' }
  }
}

function escAttr(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

/* Баглааны меta — нэр, үнэ, бүрэлдэхүүнээс */
function bouquetRoute(b) {
  const price = '₮' + Number(b.price || 0).toLocaleString('mn-MN')
  const contents = (b.contents || '').trim()
  return {
    path: `/ready/${b.slug}`,
    file: `ready/${b.slug}/index.html`,
    priority: '0.8',
    changefreq: 'weekly',
    title: `${b.name} — ${price} | Tsetsegly цэцгийн баглаа`,
    description:
      `${b.name}${contents ? ' — ' + contents : ''}. Үнэ ${price}. ` +
      'Улаанбаатарт ижил өдөртөө хүргэнэ. Захиалахын өмнө туузаа, захидлаа нэмж болно.',
    product: b,
  }
}

/* JSON-LD Product схем — Google хайлтад үнэ, боломжтой эсэхийг харуулна */
function productLd(b) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: b.name,
    description: b.contents || b.name,
    image: b.image ? SITE + b.image : SITE + '/logo.png',
    url: `${SITE}/ready/${b.slug}`,
    category: 'Цэцгийн баглаа',
    brand: { '@type': 'Brand', name: BIZ.name },
    offers: {
      '@type': 'Offer',
      url: `${SITE}/ready/${b.slug}`,
      price: String(b.price || 0),
      priceCurrency: 'MNT',
      availability: 'https://schema.org/InStock',
      seller: { '@id': SITE + '/#business' },
    },
  }
}

/* HTML-д аюулгүйгээр суулгахын тулд </script> тасалдлаас сэргийлнэ */
function safeJson(obj) {
  return JSON.stringify(obj, null, 2).replace(/</g, '\\u003c')
}

/* Өмнөх ажиллагаанд суусан тагуудыг цэвэрлэнэ.

   Скрипт dist/index.html-ийг уншиж, буцаагаад тэр рүүгээ бичдэг.
   Vite build бүрд index.html шинээр үүсдэг тул ердийн урсгалд асуудалгүй,
   гэхдээ скриптийг дангаар нь хоёр удаа ажиллуулбал таг давхарлана.
   Тиймээс эхлээд цэвэрлээд дараа нь суулгана. */
function stripInjected(html) {
  return html
    .replace(/[ \t]*<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, '')
    .replace(/[ \t]*<meta name="google-site-verification"[^>]*>\n?/g, '')
    .replace(/[ \t]*<script async src="https:\/\/www\.googletagmanager\.com[^"]*"><\/script>\n?/g, '')
    .replace(/[ \t]*<script>\n?\s*window\.dataLayer[\s\S]*?<\/script>\n?/g, '')
}

/* index.html доторх нэг meta-г солино */
function replaceTag(html, pattern, replacement) {
  if (!pattern.test(html)) {
    console.warn(`  ⚠ олдсонгүй: ${pattern}`)
    return html
  }
  return html.replace(pattern, replacement)
}

function buildPage(base, route) {
  const url = SITE + (route.path === '/' ? '/' : route.path)
  let html = stripInjected(base)

  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${route.title}</title>`)
  html = replaceTag(
    html,
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${route.description}" />`
  )
  html = replaceTag(
    html,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${url}" />`
  )
  html = replaceTag(
    html,
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${url}" />`
  )
  html = replaceTag(
    html,
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${route.title}" />`
  )
  html = replaceTag(
    html,
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${route.description}" />`
  )
  html = replaceTag(
    html,
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${route.title}" />`
  )
  html = replaceTag(
    html,
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${route.description}" />`
  )

  /* og:image — бүтээгдэхүүний хуудсанд өөрийнх нь зураг */
  if (route.product?.image) {
    const img = SITE + route.product.image
    html = replaceTag(
      html,
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${escAttr(img)}" />`
    )
    html = replaceTag(
      html,
      /<meta property="og:image:alt" content="[^"]*" \/>/,
      `<meta property="og:image:alt" content="${escAttr(route.product.name)}" />`
    )
    html = replaceTag(
      html,
      /<meta name="twitter:image" content="[^"]*" \/>/,
      `<meta name="twitter:image" content="${escAttr(img)}" />`
    )
    html = replaceTag(
      html,
      /<meta property="og:type" content="[^"]*" \/>/,
      `<meta property="og:type" content="product" />`
    )
  }

  /* Нэмэлт таг: JSON-LD + (тохируулсан бол) баталгаажуулалт, GA4 */
  let head = `  <script type="application/ld+json">\n${safeJson(jsonLd)}\n  </script>\n`

  if (route.product) {
    head += `  <script type="application/ld+json">\n${safeJson(productLd(route.product))}\n  </script>\n`
  }

  if (GSC) {
    head += `  <meta name="google-site-verification" content="${GSC}" />\n`
  }

  if (GA4) {
    head +=
      `  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA4}"></script>\n` +
      `  <script>\n` +
      `    window.dataLayer = window.dataLayer || [];\n` +
      `    function gtag(){dataLayer.push(arguments);}\n` +
      `    gtag('js', new Date());\n` +
      `    gtag('config', '${GA4}');\n` +
      `  </script>\n`
  }

  return html.replace('</head>', head + '  </head>')
}

/* ── Ажиллуулах ── */
const basePath = join(DIST, 'index.html')
let base
try {
  base = readFileSync(basePath, 'utf8')
} catch {
  console.error('✗ dist/index.html олдсонгүй. Эхлээд vite build ажиллуулна уу.')
  process.exit(1)
}

console.log('\nSEO хуудас үүсгэж байна…\n')

/* Бэлэн баглаануудыг API-аас татаж маршрутын жагсаалтад нэмнэ */
const { list: bouquets, note: apiNote } = await fetchBouquets()
const allRoutes = [...ROUTES, ...bouquets.map(bouquetRoute)]

for (const route of allRoutes) {
  const html = buildPage(base, route)
  const out = join(DIST, route.file)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html, 'utf8')
  console.log(`  ${route.path.padEnd(28)} → dist/${route.file}`)
}

if (apiNote) console.log(`\n  ⚠ Бүтээгдэхүүний хуудас алгаслаа: ${apiNote}`)

/* ── sitemap.xml — маршрутын жагсаалттай ижил эх сурвалжаас ── */
const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (r) => `  <url>
    <loc>${SITE + (r.path === '/' ? '/' : r.path)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`
writeFileSync(join(DIST, 'sitemap.xml'), sitemap, 'utf8')

console.log('')
console.log(`  sitemap.xml                ✓ ${allRoutes.length} хаяг, lastmod ${today}`)
console.log(`  Бүтээгдэхүүний хуудас      ${bouquets.length ? '✓ ' + bouquets.length : '— 0'}`)
console.log(`  JSON-LD Florist схем       ✓ бүх хуудсанд`)
console.log(`  Search Console баталгаа    ${GSC ? '✓ суулгав' : '— GSC_VERIFICATION тохируулаагүй'}`)
console.log(`  Google Analytics 4         ${GA4 ? '✓ ' + GA4 : '— GA4_ID тохируулаагүй'}`)

console.log('\n✓ Бэлэн. Дараагийн алхам — Search Console дээр sitemap илгээх.\n')
