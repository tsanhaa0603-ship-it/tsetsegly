#!/usr/bin/env node
/* ─────────────────────────────────────────────
   Instagram данс шалгагч — Tsetsegly

   Нэр дэвшигчдийн жинхэнэ дагагчийн тоо, постын тоо,
   идэвхжлийн түвшинг нэг дор шалгаж, эрэмбэлж харуулна.

   Ашиглах:
     node check-influencers.mjs handles.txt
     node check-influencers.mjs undrrly cherrymuunuu munhluu

   handles.txt — мөр бүрд нэг @хаяг (@ тэмдэг байж болно, байхгүй ч болно)

   Гаралт: терминал дээр хүснэгт + influencers.csv файл
───────────────────────────────────────────── */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'

const IG_APP_ID = '936619743392459'

/* Instagram нэрээ нууцлан хандахыг хааж эхэлбэл (HTTP 401/403/429) өөрийн
   session-оор хандана. Терминалдаа зөвхөн энэ удаагийн ажиллагаанд:

     PowerShell:  $env:IG_SESSIONID = "..."
     bash:        export IG_SESSIONID="..."

   Утгыг Chrome → instagram.com → F12 → Application → Cookies → sessionid-аас
   хуулна. Энэ бол таны нэвтрэлтийн түлхүүр — файлд бүү хадгал, git-д бүү оруул. */
const SESSION_ID = process.env.IG_SESSIONID || ''

/* ── Tsetsegly-ийн шалгуур ── */
const MIN_FOLLOWERS = 3000      // үүнээс доош бол хүрээ хэтэрхий бага
const MAX_FOLLOWERS = 80000     // үүнээс дээш бол бартер хүлээж авахгүй, үнэ өснө
const MIN_ENGAGEMENT = 2.0      // %-иар. 2%-иас доош бол дагагч нь идэвхгүй эсвэл худалдаж авсан

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Ашиглах: node check-influencers.mjs handles.txt')
  console.error('    эсвэл: node check-influencers.mjs undrrly cherrymuunuu')
  process.exit(1)
}

/* Аргументаас эсвэл файлаас хаягуудыг цуглуулна */
let handles = []
if (args.length === 1 && existsSync(args[0])) {
  handles = readFileSync(args[0], 'utf8').split('\n')
} else {
  handles = args
}
handles = handles
  .map((h) => h.trim().replace(/^@/, '').replace(/\/$/, '').split('/').pop())
  .filter(Boolean)
  .filter((h, i, a) => a.indexOf(h) === i)

console.log(`\n${handles.length} данс шалгаж байна…\n`)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function check(username) {
  const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`
  const res = await fetch(url, {
    headers: {
      'x-ig-app-id': IG_APP_ID,
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.9',
      referer: `https://www.instagram.com/${username}/`,
      'x-requested-with': 'XMLHttpRequest',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      ...(SESSION_ID ? { cookie: `sessionid=${SESSION_ID}` } : {}),
    },
  })
  if (!res.ok) return { username, error: `HTTP ${res.status}` }

  const u = (await res.json())?.data?.user
  if (!u) return { username, error: 'олдсонгүй' }

  const followers = u.edge_followed_by.count
  const posts = u.edge_owner_to_timeline_media?.edges || []

  /* Сүүлийн постуудын дундаж like/comment-оос идэвхжлийн түвшин тооцно */
  let engagement = null
  if (posts.length && followers > 0) {
    const total = posts.reduce(
      (s, e) =>
        s +
        (e.node.edge_liked_by?.count || e.node.edge_media_preview_like?.count || 0) +
        (e.node.edge_media_to_comment?.count || 0),
      0
    )
    engagement = (total / posts.length / followers) * 100
  }

  return {
    username,
    fullName: u.full_name || '',
    followers,
    postCount: u.edge_owner_to_timeline_media?.count || 0,
    engagement,
    category: u.category_name || '',
    isBusiness: !!u.is_business_account,
    isVerified: !!u.is_verified,
    isPrivate: !!u.is_private,
    website: u.external_url || '',
    bio: (u.biography || '').replace(/\s+/g, ' ').slice(0, 60),
  }
}

/* Tsetsegly-д тохирох эсэхийг үнэлнэ */
function verdict(r) {
  if (r.error) return { mark: '✗', why: r.error }
  if (r.isPrivate) return { mark: '✗', why: 'хаалттай данс' }
  if (r.followers < MIN_FOLLOWERS) return { mark: '✗', why: 'хүрээ бага' }
  if (r.followers > MAX_FOLLOWERS) return { mark: '~', why: 'том — бэлэн мөнгө шаардана' }
  if (r.engagement !== null && r.engagement < MIN_ENGAGEMENT) {
    return { mark: '✗', why: `идэвхжил сул (${r.engagement.toFixed(1)}%)` }
  }
  return { mark: '✓', why: 'бартер санал болгох' }
}

const rows = []
for (const h of handles) {
  try {
    const r = await check(h)
    rows.push(r)
    const v = verdict(r)
    const f = r.error ? '—' : r.followers.toLocaleString('mn-MN')
    const e = r.engagement == null ? '—' : r.engagement.toFixed(1) + '%'
    console.log(`${v.mark}  ${h.padEnd(26)} ${f.padStart(9)}  ${e.padStart(6)}  ${v.why}`)
  } catch (err) {
    console.log(`✗  ${h.padEnd(26)}       —       —  ${err.message}`)
    rows.push({ username: h, error: err.message })
  }
  await sleep(1200) // хэт хурдан асуувал Instagram хаадаг
}

/* CSV гаргах — цаашид хяналтын хүснэгт болгож ашиглана */
const header = [
  'handle', 'name', 'followers', 'posts', 'engagement_%', 'category',
  'business', 'verified', 'website', 'bio', 'verdict',
  'UB_audience_%', 'contacted', 'replied', 'posted', 'promo_code', 'orders',
]
const csv = [header.join(',')]
for (const r of rows) {
  const v = verdict(r)
  csv.push([
    r.username,
    `"${(r.fullName || '').replace(/"/g, '')}"`,
    r.followers ?? '',
    r.postCount ?? '',
    r.engagement == null ? '' : r.engagement.toFixed(1),
    `"${r.category || ''}"`,
    r.isBusiness ? 'y' : '',
    r.isVerified ? 'y' : '',
    r.website || '',
    `"${(r.bio || '').replace(/"/g, '')}"`,
    `"${v.why}"`,
    '', '', '', '', '', '',   // гараар бөглөх баганууд
  ].join(','))
}
writeFileSync('influencers.csv', '﻿' + csv.join('\n'), 'utf8')

const ok = rows.filter((r) => verdict(r).mark === '✓').length
/* Instagram нэвтрээгүй хандалтыг 401, 403, 429 гурван кодоор хаадаг.
   Гурвуулаа «өгөгдөл аваагүй», шийдэл нь ижил — session-оор дахин ханд. */
const BLOCKED = new Set(['HTTP 401', 'HTTP 403', 'HTTP 429'])
const blocked = rows.filter((r) => BLOCKED.has(r.error)).length

if (blocked === rows.length && rows.length > 0 && !SESSION_ID) {
  console.log('\n⚠ Instagram нэрээ нууцлан хандахыг хаалаа (401/403/429).')
  console.log('  Өөрийн session-оор дахин оролдоно уу:')
  console.log('    PowerShell:  $env:IG_SESSIONID = "<sessionid>"')
  console.log('    bash:        export IG_SESSIONID="<sessionid>"')
  console.log('  Chrome → instagram.com → F12 → Application → Cookies → sessionid\n')
  process.exit(1)
}
if (blocked === rows.length && rows.length > 0 && SESSION_ID) {
  console.log('\n⚠ Session-оор ч хаагдлаа. Түлхүүр хуучирсан байж магадгүй — дахин хуулна уу.')
  console.log('  Мөн VPN, ажлын сүлжээ, үүлэн сервер дээрээс ажиллуулбал Instagram')
  console.log('  сүлжээгээр нь шууд хаадаг — гэрийн интернетээсээ оролдоно уу.\n')
  process.exit(1)
}

console.log(`\n✓ ${ok} данс шалгуур давлаа. influencers.csv үүслээ.`)
console.log('Дараагийн алхам: давсан данс бүрээс Insights → Audience → Top locations асууж,')
console.log('УБ 70%-иас доош байвал хас. Дараа нь promo_code багана бүрд өөр код оноо.\n')
