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
import { DEFAULT_CATALOG } from '../src/lib/flowers.js'
import { DEFAULT_WRAPPINGS } from '../src/lib/wrappings.js'
import { DEFAULT_SHAPES } from '../src/lib/shapes.js'
import { DELIVERY_ZONES, CITY_DELIVERY_FEE, FREE_DELIVERY_MIN, LAST_SAME_DAY_HOUR } from '../src/lib/delivery.js'

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

/* ─────────────────────────────────────────────
   Биеийн статик агуулга

   Vite-ийн үүсгэсэн index.html-ийн бие нь <div id="root"></div>
   гэсэн хоосон элемент. Googlebot JavaScript уншиж чаддаг ч
   шинэ домэйнд удаан, дараалалд ордог тул эхний долоо хоногуудад
   хуудсууд агуулгагүй индексжинэ.

   Тиймээс #root дотор бодит агуулгыг статикаар суулгана. React
   mount хийхдээ энэ агуулгыг өөрөө солино. Хэрэглэгч ижил зүйл
   хардаг — зөвхөн хурдан харагдана. Текст нь React-ийн гаргадагтай
   тохирсон байх ёстой, өөр агуулга бичих нь cloaking болно.
───────────────────────────────────────────── */

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const mnt = (n) => '₮' + Number(n || 0).toLocaleString('mn-MN')

/* Бүх хуудсанд нийтлэг толгой ба хөл — навигаци, холбоо барих */
const NAV = `<nav aria-label="Үндсэн цэс"><a href="/">Нүүр</a> <a href="/ready">Бэлэн баглаа</a> <a href="/build">Баглаа бүтээх</a> <a href="/about">Тухай</a> <a href="/contact">Холбоо барих</a></nav>`

const FOOT = `<footer>
<p>Tsetsegly — Улаанбаатарын захиалгат цэцгийн дэлгүүр. Салбар дэлгүүргүй, зөвхөн хүргэлтээр ажилладаг.</p>
<p>Утас: <a href="tel:${BIZ.phone.replace(/[^+\d]/g, '')}">8844-4310</a> · Ажлын цаг: ${BIZ.opens}–${BIZ.closes}</p>
</footer>`

function wrapBody(inner) {
  return `<div id="root"><div class="prerender">${NAV}${inner}${FOOT}</div></div>`
}

/* Хүргэлтийн нөхцөл — олон хуудсанд давтагдана */
const deliveryBlock = `<section><h2>Хүргэлт</h2>
<p>Улаанбаатарын ${DELIVERY_ZONES.length} дүүрэгт хүргэнэ. Төлбөр бүх чиглэлд ${mnt(CITY_DELIVERY_FEE)}, ${mnt(FREE_DELIVERY_MIN)}-аас дээш захиалгад үнэгүй. ${LAST_SAME_DAY_HOUR}:00 цагаас өмнө захиалвал тухайн өдөртөө хүргэнэ.</p>
<ul>${DELIVERY_ZONES.map((z) => `<li>${esc(z.name)} дүүрэг — ${esc(z.eta)}, ${mnt(z.fee)}</li>`).join('')}</ul>
</section>`

const BODIES = {
  '/': () => wrapBody(`
<h1>Tsetsegly — захиалгат цэцгийн дэлгүүр, Улаанбаатар</h1>
<p>Таны мэдрэмж, таны өнгө, таны түүх — бид бүгдийг нэг баглаанд хувиргана. Баглаа бүрийг захиалга ирсний дараа гараар бэлтгэдэг тул тавиур дээр зогссон баглаа гэж байхгүй.</p>
<p><a href="/build">Баглаа бүтээх</a> · <a href="/ready">Бэлэн баглаа үзэх</a></p>
<section><h2>Яагаад Tsetsegly вэ</h2>
<ul>
<li><strong>Өөрөө зохионо.</strong> ${DEFAULT_CATALOG.length} ангилал цэцэг, ${DEFAULT_WRAPPINGS.length} төрлийн боолтын цаас, ${DEFAULT_SHAPES.length} хэлбэрээс сонгож баглаагаа өөрөө бүтээнэ.</li>
<li><strong>Гар хийц.</strong> Цэцэг бүрийг гар аргаар, таны захиалгаар бүтээнэ.</li>
<li><strong>Захидал үлдэнэ.</strong> QR уншуулахад нээгддэг хувийн хуудсанд захидал, зураг, дуу хавсаргана. Цэцэг хатсан ч хуудас үлдэнэ.</li>
<li><strong>Цагтаа хүрнэ.</strong> Улаанбаатар даяар хүргэлттэй.</li>
</ul></section>
${deliveryBlock}`),

  '/ready': (ctx) => wrapBody(`
<h1>Бэлэн цэцгийн баглаа</h1>
<p>Манай гар хийцийн бэлэн баглаанууд. Сонгоод шууд захиалж, эсвэл өөрийн санаагаар өөрчилж болно.</p>
${
  ctx.bouquets.length
    ? `<ul>${ctx.bouquets
        .map(
          (b) =>
            `<li><a href="/ready/${esc(b.slug)}"><strong>${esc(b.name)}</strong></a> — ${esc(b.contents)}. Үнэ ${mnt(b.price)}.</li>`
        )
        .join('')}</ul>`
    : '<p>Бэлэн баглаануудыг вэб хуудсанд харна уу.</p>'
}
<p><a href="/build">Өөрөө баглаа зохиох</a></p>
${deliveryBlock}`),

  '/build': () => wrapBody(`
<h1>Цэцгийн баглаа өөрөө зохиох</h1>
<p>Цэцэг, боолт, хэлбэр, туузаа өөрөө сонгож баглаагаа бүтээнэ. Дээр нь хүлээн авагчид зориулсан захидал, зураг, дуу агуулсан хувийн хуудас нэмнэ — QR уншуулахад нээгдэнэ.</p>
<section><h2>Цэцгийн ангилал</h2>
<ul>${DEFAULT_CATALOG.map(
    (c) =>
      `<li><strong>${esc(c.name)}</strong> — ${esc(c.hint)}. ${c.colors.length} өнгө, ${mnt(Math.min(...c.colors.map((x) => x.price)))}-аас.</li>`
  ).join('')}</ul></section>
<section><h2>Баглааны хэлбэр</h2>
<ul>${DEFAULT_SHAPES.map((s) => `<li><strong>${esc(s.name)}</strong> — ${esc(s.desc)}</li>`).join('')}</ul></section>
<section><h2>Боолтын цаас</h2>
<p>${DEFAULT_WRAPPINGS.length} төрлийн боолт: матт, сувдан, крафт, бүтэцтэй, тунгалаг, тор, тансаг хээт. Үнэ ${mnt(Math.min(...DEFAULT_WRAPPINGS.map((w) => w.price)))}-аас.</p></section>
${deliveryBlock}`),

  '/about': () => wrapBody(`
<h1>Tsetsegly-ийн тухай</h1>
<p>Tsetsegly бол Улаанбаатарын захиалгат цэцгийн дэлгүүр. Баглаа бүрийг захиалга ирсний дараа гараар бэлтгэдэг — тавиур дээр өдрөөр зогссон баглаа байхгүй.</p>
<section><h2>Бидний онцлог</h2>
<ul>
<li><strong>Гар хийц.</strong> Цэцэг бүрийг гар аргаар, таны захиалгаар бүтээнэ.</li>
<li><strong>Мэдрэмжтэй.</strong> Таны түүхийг цэцгийн баглаагаар илэрхийлнэ.</li>
<li><strong>Дижитал захидал.</strong> Баглаанд QR суулгаж мэндчилгээ, дуу, зураг хавсаргах боломжтой.</li>
</ul></section>
<section><h2>Тоогоор</h2>
<ul>
<li>${DEFAULT_CATALOG.reduce((s, c) => s + c.colors.length, 0)}+ цэцгийн зүйл</li>
<li>${DEFAULT_CATALOG.length} ангилал</li>
<li>${DEFAULT_WRAPPINGS.length} төрлийн боолт</li>
<li>100% гар хийц</li>
</ul></section>
<p><a href="/build">Баглаа бүтээх</a></p>`),

  '/contact': () => wrapBody(`
<h1>Холбоо барих</h1>
<p>Захиалга, асуулт, хамтын ажиллагааны талаар бидэнтэй чөлөөтэй холбогдоорой.</p>
<ul>
<li>Утас: <a href="tel:88444310">8844-4310</a></li>
<li>Имэйл: <a href="mailto:${BIZ.email}">${BIZ.email}</a></li>
<li>Үйлчилгээ: Улаанбаатар хот, зөвхөн хүргэлт</li>
<li>Ажлын цаг: ${BIZ.opens}–${BIZ.closes}</li>
</ul>
<p>Tsetsegly салбар дэлгүүргүй. Баглаа бүрийг захиалга ирсний дараа гараар бэлтгэж, таны заасан хаягт хүргэж өгдөг.</p>
${deliveryBlock}`),
}

/* Бүтээгдэхүүний хуудасны бие */
function productBody(b) {
  const flowers = Object.entries(b.preset?.flowers || {}).filter(([, q]) => q > 0)
  const flat = {}
  for (const cat of DEFAULT_CATALOG) {
    for (const col of cat.colors) flat[`${cat.key}:${col.key}`] = col.name
  }
  const shape = DEFAULT_SHAPES.find((s) => s.id === b.preset?.shape)
  const wrap = DEFAULT_WRAPPINGS.find((w) => w.id === b.preset?.wrapping)
  const free = Number(b.price) >= FREE_DELIVERY_MIN

  return wrapBody(`
<p><a href="/">Нүүр</a> / <a href="/ready">Бэлэн баглаа</a> / ${esc(b.name)}</p>
<h1>${esc(b.name)}</h1>
<p>${esc(b.contents)}</p>
<p><strong>Үнэ: ${mnt(b.price)}</strong></p>
${
  flowers.length
    ? `<section><h2>Бүрэлдэхүүн</h2><ul>${flowers
        .map(([k, q]) => `<li>${esc(flat[k] || k)} × ${q}</li>`)
        .join('')}</ul>${
        shape || wrap
          ? `<p>${shape ? 'Хэлбэр: ' + esc(shape.name) : ''}${shape && wrap ? ' · ' : ''}${wrap ? 'Боолт: ' + esc(wrap.name) : ''}</p>`
          : ''
      }</section>`
    : ''
}
<section><h2>Хүргэлт</h2>
<p>${
    free
      ? 'Улаанбаатар даяар хүргэлт үнэгүй.'
      : `Улаанбаатарын ${DELIVERY_ZONES.length} дүүрэгт ${mnt(CITY_DELIVERY_FEE)}. ${mnt(FREE_DELIVERY_MIN)}-аас дээш захиалгад үнэгүй.`
  } ${LAST_SAME_DAY_HOUR}:00 цагаас өмнө захиалвал өнөөдөртөө хүргэнэ.</p></section>
<p><a href="/build">Энэ баглааг захиалах</a> — захиалахын өмнө туузаа, захидлаа нэмж, өөрчилж болно.</p>`)
}

/* Өмнөх ажиллагаанд суусан тагуудыг цэвэрлэнэ.

   Скрипт dist/index.html-ийг уншиж, буцаагаад тэр рүүгээ бичдэг.
   Vite build бүрд index.html шинээр үүсдэг тул ердийн урсгалд асуудалгүй,
   гэхдээ скриптийг дангаар нь хоёр удаа ажиллуулбал таг давхарлана.
   Тиймээс эхлээд цэвэрлээд дараа нь суулгана. */
function stripInjected(html) {
  return html
    /* Vite бүтээгдсэн index.html-ийн бие нь зөвхөн #root агуулдаг (script нь
       head-д ордог), тиймээс </body> хүртэл бүхэлд нь тэглэнэ. */
    .replace(/<div id="root">[\s\S]*<\/body>/, '<div id="root"></div>\n  </body>')
    .replace(/[ \t]*<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, '')
    .replace(/[ \t]*<style>\s*\.prerender[\s\S]*?<\/style>\n?/g, '')
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

function buildPage(base, route, ctx) {
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

  /* Статик агуулгын хэв маяг. Tailwind-ийн preflight нь h1, p зэргийг
     тэглэдэг тул React ачаалагдах хүртэлх хэдэн зуун миллисекундэд
     агуулга задгай харагдахаас сэргийлж энгийн typography өгнө. */
  let head =
    `  <style>\n` +
    `    .prerender{max-width:52rem;margin:0 auto;padding:6rem 1.5rem 3rem;color:#1A1A1A;` +
    `font-family:Georgia,serif;line-height:1.7}\n` +
    `    .prerender h1{font-size:2.25rem;line-height:1.2;margin:0 0 1rem;font-style:italic}\n` +
    `    .prerender h2{font-size:1.4rem;margin:2rem 0 .6rem}\n` +
    `    .prerender p{margin:0 0 .9rem}\n` +
    `    .prerender ul{margin:0 0 1rem;padding-left:1.25rem}\n` +
    `    .prerender li{margin:0 0 .4rem}\n` +
    `    .prerender a{color:#8A6E2F}\n` +
    `    .prerender nav a{margin-right:1rem;text-transform:uppercase;font-size:.8rem;letter-spacing:.1em}\n` +
    `    .prerender footer{margin-top:3rem;padding-top:1rem;border-top:1px solid #E2D8C4;font-size:.9rem;color:#5A5348}\n` +
    `  </style>\n` +
    `  <script type="application/ld+json">\n${safeJson(jsonLd)}\n  </script>\n`

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

  html = html.replace('</head>', head + '  </head>')

  /* Биеийн статик агуулга — Googlebot JS ажиллуулахгүйгээр уншина */
  const body = route.product ? productBody(route.product) : BODIES[route.path]?.(ctx)
  if (body) {
    html = html.replace('<div id="root"></div>', body)
  } else {
    console.warn(`  ⚠ ${route.path} — биеийн агуулга тодорхойлогдоогүй`)
  }

  return html
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
  const html = buildPage(base, route, { bouquets })
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
