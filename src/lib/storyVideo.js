/* ─────────────────────────────────────────────
   Story бичлэг үүсгэх (1080×1920, ~14 сек)

   Мэндчилгээний бүх зүйл эрэмблэн урсаж харагдана:
     1. Мэндчилгээ  → лого, "{нэр}, танд бэлэг ирлээ"
     2. Захидал     → текст дээшээ урсана
     3. Зургууд     → зөөлөн солигдоно
     4. Баглаа+CTA  → цэцэг, хэлбэр, tsetsegly.mn

   Canvas-ыг captureStream + MediaRecorder-оор бичнэ.
   mp4 дэмжигдвэл mp4, эс бөгөөс webm гаргана.
───────────────────────────────────────────── */

const W = 1080
const H = 1920
const FPS = 30

const MIME_CANDIDATES = [
  'video/mp4;codecs=avc1.42E01E',
  'video/mp4',
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8',
  'video/webm',
]

export function pickMimeType() {
  if (typeof MediaRecorder === 'undefined') return null
  return MIME_CANDIDATES.find((t) => MediaRecorder.isTypeSupported(t)) || null
}

export function canRecordVideo() {
  return (
    typeof MediaRecorder !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof document.createElement('canvas').captureStream === 'function' &&
    !!pickMimeType()
  )
}

/* ── Туслах ── */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const easeOut = (t) => 1 - Math.pow(1 - clamp(t), 3)
const easeInOut = (t) => (clamp(t) < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

async function waitForFonts() {
  if (typeof document === 'undefined' || !document.fonts) return
  try {
    await document.fonts.ready
    await Promise.all([
      document.fonts.load('italic 700 96px "Playfair Display"'),
      document.fonts.load('400 44px "Cormorant Garamond"'),
      document.fonts.load('600 60px "Caveat"'),
    ])
  } catch { /* фонтгүй ч ажиллана */ }
}

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
    setTimeout(() => resolve(null), 4000)
  })
}

function goldGradient(ctx, cx, y, w) {
  const g = ctx.createLinearGradient(cx - w / 2, y, cx + w / 2, y)
  g.addColorStop(0, '#E8D6A8')
  g.addColorStop(0.5, '#C9A961')
  g.addColorStop(1, '#8A6E2F')
  return g
}

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

/* Дэвсгэр — бөмбөлгүүд аажим хөдөлж амьд харагдана */
function drawBackground(ctx, t) {
  ctx.fillStyle = '#FAF7F2'
  ctx.fillRect(0, 0, W, H)
  const s = Math.sin(t * 0.5), c = Math.cos(t * 0.4)
  orb(ctx, W * 0.85 + s * 30, H * 0.12 + c * 24, 470, 0.5)
  orb(ctx, W * 0.10 - s * 26, H * 0.82 - c * 20, 430, 0.42)
  orb(ctx, W * 0.50 + c * 18, H * 0.50 + s * 22, 620, 0.13)
  ctx.strokeStyle = 'rgba(201,169,97,0.4)'
  ctx.lineWidth = 3
  ctx.strokeRect(48, 48, W - 96, H - 96)
}

/* Мөр болгон таслах */
function wrapLines(ctx, text, maxW) {
  const out = []
  for (const para of String(text).split('\n')) {
    if (!para.trim()) { out.push(''); continue }
    let line = ''
    for (const word of para.split(' ')) {
      const test = line ? `${line} ${word}` : word
      if (ctx.measureText(test).width > maxW && line) { out.push(line); line = word }
      else line = test
    }
    if (line) out.push(line)
  }
  return out
}

function divider(ctx, cx, y, w, alpha = 1) {
  const g = ctx.createLinearGradient(cx - w / 2, y, cx + w / 2, y)
  g.addColorStop(0, 'rgba(201,169,97,0)')
  g.addColorStop(0.5, `rgba(201,169,97,${0.9 * alpha})`)
  g.addColorStop(1, 'rgba(201,169,97,0)')
  ctx.fillStyle = g
  ctx.fillRect(cx - w / 2, y, w, 3)
}

/* Дугуй логотой толгой хэсэг */
function drawHeader(ctx, logo, cx, y, alpha) {
  ctx.globalAlpha = alpha
  if (logo) {
    const size = 150
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, y, size / 2, 0, Math.PI * 2)
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
  }
  ctx.textAlign = 'center'
  ctx.font = 'italic 700 66px "Playfair Display", Georgia, serif'
  ctx.fillStyle = goldGradient(ctx, cx, y + 130, 360)
  ctx.fillText('Tsetsegly', cx, y + 130)
  ctx.globalAlpha = 1
}

/* Доод CTA */
function drawFooter(ctx, cx, siteUrl, alpha) {
  ctx.globalAlpha = alpha
  ctx.textAlign = 'center'
  ctx.font = '400 40px "Cormorant Garamond", Georgia, serif'
  ctx.fillStyle = 'rgba(26,26,26,0.5)'
  ctx.fillText('Өөрийн баглаагаа бүтээх', cx, H - 235)
  ctx.font = 'italic 600 54px "Playfair Display", Georgia, serif'
  ctx.fillStyle = goldGradient(ctx, cx, H - 168, 480)
  ctx.fillText(siteUrl || 'tsetsegly.mn', cx, H - 168)
  ctx.globalAlpha = 1
}

/* Зургийг хүрээнд багтаан зурах (cover) */
function drawCover(ctx, img, x, y, w, h, radius = 32) {
  const ir = img.width / img.height
  const fr = w / h
  let sw, sh, sx, sy
  if (ir > fr) { sh = img.height; sw = sh * fr; sx = (img.width - sw) / 2; sy = 0 }
  else { sw = img.width; sh = sw / fr; sx = 0; sy = (img.height - sh) / 2 }
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, radius)
  ctx.clip()
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
  ctx.restore()
  ctx.strokeStyle = 'rgba(201,169,97,0.5)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, radius)
  ctx.stroke()
}

/* ─────────────────────────────────────────────
   Зурагчийг бэлдэнэ — дүр зургууд, хугацаа, өгөгдөл.
   Бичлэг бичих болон тусдаа кадр зурахад ижил кодыг
   ашиглана (зурах логик нэг газар).
───────────────────────────────────────────── */
async function createRenderer({
  recipientName, senderName, letterText, photos = [], flowers = [],
  shapeName, wrapName, siteUrl,
} = {}) {
  await waitForFonts()
  const logo = await loadImage('/logo.png')
  const photoImgs = (await Promise.all(photos.slice(0, 4).map(loadImage))).filter(Boolean)

  // ── Дүр зургууд, хугацаа (сек) ──
  const scenes = [{ key: 'intro', dur: 3.4 }]
  if (letterText && letterText.trim()) scenes.push({ key: 'letter', dur: 5.0 })
  if (photoImgs.length) scenes.push({ key: 'photos', dur: Math.min(4.5, 1.6 * photoImgs.length + 1) })
  scenes.push({ key: 'outro', dur: 3.2 })
  const total = scenes.reduce((s, x) => s + x.dur, 0)

  // Захидлын мөрүүдийг урьдчилан тооцно
  const measure = document.createElement('canvas').getContext('2d')
  measure.font = '400 52px "Cormorant Garamond", Georgia, serif'
  const letterLines = letterText ? wrapLines(measure, letterText.trim(), W - 280) : []

  const cx = W / 2

  /** Тухайн t секундэд харгалзах кадрыг зурна */
  function draw(ctx, t) {
    let acc = 0, scene = scenes[0], local = 0
    for (const s of scenes) {
      if (t < acc + s.dur) { scene = s; local = t - acc; break }
      acc += s.dur
    }
    const p = local / scene.dur          // дүр зургийн явц 0..1
    const fade = Math.min(easeOut(local / 0.6), easeOut((scene.dur - local) / 0.5))

    drawBackground(ctx, t)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'

    if (scene.key === 'intro') {
      drawHeader(ctx, logo, cx, 330, fade)
      const rise = (1 - easeOut(local / 1.2)) * 40
      ctx.globalAlpha = fade
      ctx.font = '400 250px serif'
      ctx.fillText('💐', cx, 830 + rise)

      ctx.font = 'italic 700 96px "Playfair Display", Georgia, serif'
      ctx.fillStyle = '#1A1A1A'
      ctx.fillText(recipientName ? recipientName + ',' : 'Танд', cx, 1000 + rise)
      ctx.fillStyle = goldGradient(ctx, cx, 1110, 700)
      ctx.fillText('танд бэлэг ирлээ', cx, 1110 + rise)
      divider(ctx, cx, 1180 + rise, 260, fade)
      if (senderName) {
        ctx.font = '400 46px "Cormorant Garamond", Georgia, serif'
        ctx.fillStyle = 'rgba(26,26,26,0.6)'
        ctx.fillText(senderName + '-аас', cx, 1270 + rise)
      }
      ctx.globalAlpha = 1
    }

    else if (scene.key === 'letter') {
      drawHeader(ctx, logo, cx, 300, fade * 0.85)
      ctx.globalAlpha = fade
      ctx.font = '400 40px "Cormorant Garamond", Georgia, serif'
      ctx.fillStyle = 'rgba(201,169,97,0.9)'
      ctx.fillText('💌  Захидал', cx, 610)

      // Урт захидал дээшээ урсана; богино бол голлон харагдана
      const lineH = 74
      const blockH = letterLines.length * lineH
      const viewTop = 690, viewH = 900
      const scrolls = blockH > viewH
      const scroll = scrolls ? (blockH - viewH + 60) * easeInOut(clamp((p - 0.12) / 0.76)) : 0
      const startY = scrolls
        ? viewTop + 60
        : viewTop + (viewH - blockH) / 2 + lineH * 0.7

      ctx.save()
      ctx.beginPath()
      ctx.rect(0, viewTop, W, viewH)
      ctx.clip()
      ctx.font = '400 52px "Cormorant Garamond", Georgia, serif'
      ctx.fillStyle = 'rgba(26,26,26,0.85)'
      letterLines.forEach((l, i) => {
        ctx.fillText(l, cx, startY + i * lineH - scroll)
      })
      ctx.restore()
      ctx.globalAlpha = 1
    }

    else if (scene.key === 'photos') {
      drawHeader(ctx, logo, cx, 300, fade * 0.85)
      ctx.globalAlpha = fade
      ctx.font = '400 40px "Cormorant Garamond", Georgia, serif'
      ctx.fillStyle = 'rgba(201,169,97,0.9)'
      ctx.fillText('📸  Дурсамжууд', cx, 610)

      const per = 1 / photoImgs.length
      const idx = Math.min(photoImgs.length - 1, Math.floor(p / per))
      const lp = (p - idx * per) / per
      const a = Math.min(easeOut(lp / 0.22), easeOut((1 - lp) / 0.22))
      const zoom = 1 + 0.05 * lp
      const bw = 760 * zoom, bh = 950 * zoom
      ctx.globalAlpha = fade * a
      drawCover(ctx, photoImgs[idx], cx - bw / 2, 700 - (bh - 950) / 2, bw, bh)

      // Цэгүүд
      ctx.globalAlpha = fade
      photoImgs.forEach((_, i) => {
        ctx.fillStyle = i === idx ? '#C9A961' : 'rgba(201,169,97,0.3)'
        ctx.beginPath()
        ctx.arc(cx - (photoImgs.length - 1) * 18 + i * 36, 1730, 8, 0, Math.PI * 2)
        ctx.fill()
      })
      ctx.globalAlpha = 1
    }

    else if (scene.key === 'outro') {
      drawHeader(ctx, logo, cx, 330, fade)
      ctx.globalAlpha = fade
      ctx.font = '400 40px "Cormorant Garamond", Georgia, serif'
      ctx.fillStyle = 'rgba(201,169,97,0.9)'
      ctx.fillText('💐  Таны баглаа', cx, 660)

      ctx.font = '400 52px "Cormorant Garamond", Georgia, serif'
      ctx.fillStyle = 'rgba(26,26,26,0.8)'
      let ly = 780
      flowers.slice(0, 4).forEach((f) => {
        const label = f.qty > 1 ? f.name + ' × ' + f.qty : f.name
        ctx.fillText(label, cx, ly)
        ly += 72
      })
      ctx.fillStyle = 'rgba(26,26,26,0.55)'
      if (shapeName) { ctx.fillText('◆ ' + shapeName, cx, ly); ly += 68 }
      if (wrapName) { ctx.fillText('✦ ' + wrapName, cx, ly); ly += 68 }
      divider(ctx, cx, ly + 10, 260, fade)
      ctx.globalAlpha = 1
    }

    drawFooter(ctx, cx, siteUrl, scene.key === 'intro' ? fade : 0.9 * fade)
  }

  return { draw, total, scenes }
}

/**
 * Story бичлэг үүсгэнэ.
 * @returns {Promise<{blob: Blob, ext: string}>}
 */
export async function buildStoryVideo(opts = {}) {
  const { onProgress } = opts
  const { draw, total } = await createRenderer(opts)

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  const mimeType = pickMimeType()
  if (!mimeType) throw new Error('MediaRecorder дэмжихгүй')
  const ext = mimeType.startsWith('video/mp4') ? 'mp4' : 'webm'

  const stream = canvas.captureStream(FPS)
  const chunks = []
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6000000 })
  recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data) }

  const done = new Promise((resolve) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }))
  })

  // Эхний кадрыг бичиж эхлэхээс өмнө зурчихна
  draw(ctx, 0)
  recorder.start()

  const start = performance.now()
  await new Promise((resolve) => {
    function frame() {
      const t = (performance.now() - start) / 1000
      if (t >= total) return resolve()
      draw(ctx, t)
      if (onProgress) onProgress(clamp(t / total))
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  })

  recorder.stop()
  stream.getTracks().forEach((tr) => tr.stop())
  const blob = await done
  if (onProgress) onProgress(1)
  return { blob, ext }
}

/**
 * Тухайн секундүүдэд харгалзах кадруудыг canvas болгон зурна.
 * (Бичлэгийг шалгах, урьдчилан харахад)
 */
export async function renderStoryFrames(opts = {}, times = [1.5, 5, 8, 11.5]) {
  const { draw, total } = await createRenderer(opts)
  return times
    .filter((t) => t < total)
    .map((t) => {
      const c = document.createElement('canvas')
      c.width = W
      c.height = H
      draw(c.getContext('2d'), t)
      return c
    })
}

/** Blob → File */
export function videoToFile(blob, ext = 'mp4') {
  return new File([blob], 'tsetsegly-beleg.' + ext, { type: blob.type })
}
