/* ─────────────────────────────────────────────
   Story-д зориулсан зураг үүсгэх (1080×1920)

   Яагаад зураг вэ: Facebook болон Instagram-ын Story нь
   ЗӨВХӨН зураг/бичлэг хүлээж авдаг — холбоос хүлээж авдаггүй.
   Тиймээс navigator.share-т url биш, файл дамжуулж байж
   "Story" сонголт гарч ирдэг.

   Хувийн нууц: захидлын текст, хувийн зургийг ОРУУЛАХГҮЙ.
   Зөвхөн "бэлэг ирлээ" мэдэгдэл, нэр, брэнд харагдана.
───────────────────────────────────────────── */

const W = 1080
const H = 1920

/* Фонт ачаалагдсаныг хүлээнэ — эс тэгвэл canvas орлуулах фонт хэрэглэнэ */
async function waitForFonts() {
  if (typeof document === 'undefined' || !document.fonts) return
  try {
    await document.fonts.ready
    await Promise.all([
      document.fonts.load('italic 700 96px "Playfair Display"'),
      document.fonts.load('400 44px "Cormorant Garamond"'),
    ])
  } catch {
    /* фонт ачаалагдаагүй ч зураг үүснэ */
  }
}

/* Алтан градиент — текстэд */
function goldGradient(ctx, x, y, w) {
  const g = ctx.createLinearGradient(x - w / 2, y, x + w / 2, y)
  g.addColorStop(0, '#E8D6A8')
  g.addColorStop(0.5, '#C9A961')
  g.addColorStop(1, '#8A6E2F')
  return g
}

/* Зөөлөн алтан бөмбөлөг (Hero-той ижил аяс) */
function orb(ctx, cx, cy, r, alpha) {
  const g = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.1, cx, cy, r)
  g.addColorStop(0, `rgba(244,235,211,${alpha})`)
  g.addColorStop(0.55, `rgba(201,169,97,${alpha * 0.6})`)
  g.addColorStop(1, 'rgba(201,169,97,0)')
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fill()
}

/* Голлуулж, олон мөрөөр бичих */
function centerText(ctx, text, cx, y, maxW, lineH) {
  const words = String(text).split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  lines.forEach((l, i) => ctx.fillText(l, cx, y + i * lineH))
  return lines.length
}

/* Нимгэн алтан зураас */
function divider(ctx, cx, y, w) {
  const g = ctx.createLinearGradient(cx - w / 2, y, cx + w / 2, y)
  g.addColorStop(0, 'rgba(201,169,97,0)')
  g.addColorStop(0.5, 'rgba(201,169,97,0.9)')
  g.addColorStop(1, 'rgba(201,169,97,0)')
  ctx.fillStyle = g
  ctx.fillRect(cx - w / 2, y, w, 3)
}

/* Лого зураг ачаалах (байхгүй бол алгасана) */
function loadLogo() {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = '/logo.png'
    setTimeout(() => resolve(null), 3000)
  })
}

/**
 * Story зураг үүсгээд Blob буцаана.
 * @param {{recipientName?: string, senderName?: string, siteUrl?: string}} opts
 */
export async function buildStoryImage({ recipientName, senderName, siteUrl } = {}) {
  await waitForFonts()
  const logo = await loadLogo()

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  const cx = W / 2

  // ── Дэвсгэр ──
  ctx.fillStyle = '#FAF7F2'
  ctx.fillRect(0, 0, W, H)
  orb(ctx, W * 0.85, H * 0.12, 460, 0.5)
  orb(ctx, W * 0.1, H * 0.82, 420, 0.42)
  orb(ctx, W * 0.5, H * 0.5, 620, 0.14)

  // ── Хүрээ ──
  ctx.strokeStyle = 'rgba(201,169,97,0.45)'
  ctx.lineWidth = 3
  ctx.strokeRect(48, 48, W - 96, H - 96)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  // ── Лого ──
  let y = 360
  if (logo) {
    const size = 190
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, y, size / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.fillStyle = '#17392B'
    ctx.fillRect(cx - size / 2, y - size / 2, size, size)
    ctx.drawImage(logo, cx - size / 2, y - size / 2, size, size)
    ctx.restore()
    ctx.strokeStyle = 'rgba(201,169,97,0.6)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(cx, y, size / 2, 0, Math.PI * 2)
    ctx.stroke()
    y += 175
  } else {
    y += 40
  }

  // ── Брэнд ──
  ctx.font = 'italic 700 88px "Playfair Display", Georgia, serif'
  ctx.fillStyle = goldGradient(ctx, cx, y, 460)
  ctx.fillText('Tsetsegly', cx, y)
  y += 56

  ctx.font = '400 34px "Cormorant Garamond", Georgia, serif'
  ctx.fillStyle = 'rgba(26,26,26,0.45)'
  ctx.fillText('M A D E - T O - O R D E R   F L O W E R S', cx, y)

  // ── Гол мэдэгдэл ──
  y += 300
  ctx.font = '400 300px serif'
  ctx.fillText('💐', cx, y)

  y += 150
  ctx.font = 'italic 700 104px "Playfair Display", Georgia, serif'
  ctx.fillStyle = '#1A1A1A'
  const title = recipientName ? `${recipientName},` : 'Танд'
  ctx.fillText(title, cx, y)

  y += 118
  ctx.fillStyle = goldGradient(ctx, cx, y, 720)
  ctx.fillText('танд бэлэг ирлээ', cx, y)

  y += 80
  divider(ctx, cx, y, 260)

  // ── Илгээгч ──
  if (senderName) {
    y += 96
    ctx.font = '400 48px "Cormorant Garamond", Georgia, serif'
    ctx.fillStyle = 'rgba(26,26,26,0.6)'
    centerText(ctx, `${senderName}-аас`, cx, y, W - 260, 60)
  }

  // ── Доод хэсэг ──
  ctx.font = '400 44px "Cormorant Garamond", Georgia, serif'
  ctx.fillStyle = 'rgba(26,26,26,0.5)'
  ctx.fillText('Өөрийн баглаагаа бүтээх', cx, H - 250)

  ctx.font = 'italic 600 58px "Playfair Display", Georgia, serif'
  ctx.fillStyle = goldGradient(ctx, cx, H - 175, 520)
  ctx.fillText(siteUrl || 'tsetsegly.mn', cx, H - 175)

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 0.95))
}

/** Blob → File (navigator.share-т файл хэрэгтэй) */
export function blobToFile(blob, name = 'tsetsegly-beleg.png') {
  return new File([blob], name, { type: 'image/png' })
}
