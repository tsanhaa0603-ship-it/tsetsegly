import { useState, useEffect } from 'react'
import { trackGiftShared } from '../../lib/analytics'
import { buildStoryImage, blobToFile } from '../../lib/storyImage'
import { buildStoryVideo, videoToFile, canRecordVideo } from '../../lib/storyVideo'

/* ─────────────────────────────────────────────
   Бэлгийн хуудсыг хуваалцах

   Тархалтын гогцоо: хүлээн авагч хуудсаа Story-доо эсвэл
   найздаа явуулна → шинэ хүн Tsetsegly-г хардаг → доорх
   «өөрөө бүтээх» товчоор захиалагч болно.

   ЯАГААД ХОЁР АЛХАМ ВЭ:
   Утсан дээр navigator.share() нь хэрэглэгчийн товшилтын
   дараа ХЭДХЭН СЕКУНДЫН дотор дуудагдах ёстой. Бичлэг бэлдэхэд
   ~13 сек зарцуулагддаг тул нэг товчоор хийвэл iOS/Android
   хуваалцах цэсийг ХААДАГ. Тиймээс:
     1) "Story бэлдэх"    → медиаг үүсгэж, урьдчилан харуулна
     2) "Хуваалцах"       → шууд share() дуудна (товшилт шинэ)

   Вэбээс Story руу ШУУД орох боломжгүй (Instagram/Facebook-ийн
   Story deep link нь зөвхөн native апп-д ажиллана). Хамгийн ойр
   зам: файлыг share() руу өгөх → цэснээс Instagram/Facebook
   сонгоход media-тайгаа Story-д шууд ордог.
───────────────────────────────────────────── */
export default function ShareGift({
  senderName, recipientName, letterText, photos, flowers, shapeName, wrapName,
}) {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [note, setNote] = useState('')
  const [media, setMedia] = useState(null)   // { file, url, kind }

  const url = typeof window !== 'undefined' ? window.location.href : ''
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  const canShareFiles = canShare && typeof navigator.canShare === 'function'

  const shareText = senderName
    ? `${senderName}-аас надад ийм бэлэг ирлээ 💐`
    : 'Надад ийм бэлэг ирлээ 💐'

  // Урьдчилан харах URL-ыг цэвэрлэнэ
  useEffect(() => () => { if (media?.url) URL.revokeObjectURL(media.url) }, [media])

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } catch {
        setFailed(true)
        document.body.removeChild(ta)
        return
      }
      document.body.removeChild(ta)
    }
    setCopied(true)
    setFailed(false)
    trackGiftShared('copy')
    setTimeout(() => setCopied(false), 2200)
  }

  /* Холбоосыг хуваалцах (Messenger, Viber, мессеж г.м) */
  async function shareLink() {
    if (!canShare) return copyLink()
    try {
      await navigator.share({ title: 'Танд зориулсан бэлэг', text: shareText, url })
      trackGiftShared('native')
    } catch (e) {
      if (e?.name !== 'AbortError') copyLink()
    }
  }

  /* ── Алхам 1: медиа бэлдэх ── */
  async function prepare() {
    setBusy(true)
    setNote('')
    setProgress(0)
    const host = typeof window !== 'undefined' ? window.location.host : 'tsetsegly.mn'

    try {
      let file, kind
      if (canRecordVideo()) {
        const { blob, ext } = await buildStoryVideo({
          recipientName, senderName, letterText, photos, flowers,
          shapeName, wrapName, siteUrl: host,
          onProgress: setProgress,
        })
        if (!blob || !blob.size) throw new Error('empty')
        file = videoToFile(blob, ext)
        kind = 'video'
      } else {
        const blob = await buildStoryImage({ recipientName, senderName, siteUrl: host })
        if (!blob) throw new Error('empty')
        file = blobToFile(blob)
        kind = 'image'
      }
      setMedia({ file, url: URL.createObjectURL(file), kind })
      setNote('Бэлэн! Доорх товчоор Instagram эсвэл Facebook → Story сонгоно уу.')
    } catch {
      // Бичлэг бүтэлгүйтвэл зургаар оролдоно
      try {
        const blob = await buildStoryImage({ recipientName, senderName, siteUrl: host })
        const f = blobToFile(blob)
        setMedia({ file: f, url: URL.createObjectURL(f), kind: 'image' })
        setNote('Бэлэн! Доорх товчоор Instagram эсвэл Facebook → Story сонгоно уу.')
      } catch {
        setNote('Үүсгэж чадсангүй. Холбоосыг хуулж хуваалцана уу.')
      }
    } finally {
      setBusy(false)
      setProgress(0)
    }
  }

  /* ── Алхам 2: шууд хуваалцах (товшилтын эрх шинэ тул хаагдахгүй) ── */
  async function shareMedia() {
    if (!media) return
    const { file, kind } = media

    if (canShareFiles && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text: shareText })
        trackGiftShared(kind === 'video' ? 'story_video' : 'story')
        setNote('Цэснээс Instagram эсвэл Facebook → Story сонгоно уу.')
        return
      } catch (e) {
        if (e?.name === 'AbortError') return
        setNote('Хуваалцах цэс нээгдсэнгүй — доорхоос татаад Story-доо оруулна уу.')
        return
      }
    }
    // Файл хуваалцахыг дэмжихгүй бол татаж өгнө
    download()
  }

  function download() {
    if (!media) return
    const a = document.createElement('a')
    a.href = media.url
    a.download = media.file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    trackGiftShared(media.kind === 'video' ? 'story_video_download' : 'story_download')
    setNote(media.kind === 'video'
      ? 'Бичлэг татагдлаа — Story-доо оруулаад хуваалцаарай.'
      : 'Зураг татагдлаа — Story-доо оруулаад хуваалцаарай.')
  }

  return (
    <div className="text-center">
      <div className="flex flex-col gap-2.5 max-w-sm mx-auto">

        {/* ── Алхам 1: бэлдэх ── */}
        {!media && (
          <button
            onClick={prepare}
            disabled={busy}
            className={`group relative px-6 py-3.5 font-cormorant text-sm tracking-widest uppercase overflow-hidden rounded-xl ${busy ? 'opacity-70 cursor-wait' : ''}`}
          >
            <span className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #F4EBD3, #C9A961, #8A6E2F)' }} />
            {!busy && (
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, #8A6E2F, #C9A961, #F4EBD3)' }} />
            )}
            {busy && progress > 0 && (
              <span className="absolute inset-y-0 left-0 transition-all duration-150"
                style={{ width: `${Math.round(progress * 100)}%`, background: 'rgba(255,255,255,0.35)' }} />
            )}
            <span className="relative text-ink font-medium flex items-center justify-center gap-2">
              <span aria-hidden="true">🎬</span>
              {busy
                ? `Бэлдэж байна… ${progress > 0 ? Math.round(progress * 100) + '%' : ''}`
                : 'Story бэлдэх'}
            </span>
          </button>
        )}

        {/* ── Алхам 2: урьдчилан харах + хуваалцах ── */}
        {media && (
          <div className="flex flex-col gap-2.5">
            <div className="mx-auto rounded-2xl overflow-hidden border border-gold-light/70 shadow-sm"
              style={{ width: 150, aspectRatio: '9 / 16', background: '#FAF7F2' }}>
              {media.kind === 'video' ? (
                <video src={media.url} className="w-full h-full object-cover"
                  autoPlay loop muted playsInline />
              ) : (
                <img src={media.url} alt="" className="w-full h-full object-cover" />
              )}
            </div>

            <button
              onClick={shareMedia}
              className="group relative px-6 py-3.5 font-cormorant text-sm tracking-widest uppercase overflow-hidden rounded-xl"
            >
              <span className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #F4EBD3, #C9A961, #8A6E2F)' }} />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, #8A6E2F, #C9A961, #F4EBD3)' }} />
              <span className="relative text-ink font-medium flex items-center justify-center gap-2">
                <span aria-hidden="true">📤</span> Story-д хуваалцах
              </span>
            </button>

            <div className="flex gap-2.5">
              <button onClick={download}
                className="flex-1 px-4 py-2.5 font-cormorant text-sm tracking-widest uppercase rounded-xl border border-gold-mid/40 text-ink/70 hover:bg-gold-light/30 hover:text-ink transition-colors">
                ⬇ Татах
              </button>
              <button onClick={() => { setMedia(null); setNote('') }}
                className="flex-1 px-4 py-2.5 font-cormorant text-sm tracking-widest uppercase rounded-xl border border-gold-mid/40 text-ink/70 hover:bg-gold-light/30 hover:text-ink transition-colors">
                ↻ Дахин
              </button>
            </div>
          </div>
        )}

        {/* ── Холбоосоор илгээх ── */}
        <div className="flex gap-2.5">
          <button
            onClick={shareLink}
            className="flex-1 px-4 py-3 font-cormorant text-sm tracking-widest uppercase rounded-xl border border-gold-mid/40 text-ink/70 hover:bg-gold-light/30 hover:text-ink transition-colors"
          >
            💌 {canShare ? 'Илгээх' : 'Холбоос'}
          </button>
          <button
            onClick={copyLink}
            className="flex-1 px-4 py-3 font-cormorant text-sm tracking-widest uppercase rounded-xl border border-gold-mid/40 text-ink/70 hover:bg-gold-light/30 hover:text-ink transition-colors"
          >
            {copied ? '✓ Хууллаа' : 'Хуулах'}
          </button>
        </div>
      </div>

      {/* Тайлбар */}
      <p
        className="font-cormorant text-xs text-ink/40 mt-3 max-w-xs mx-auto leading-relaxed"
        aria-live="polite"
      >
        {failed
          ? 'Хуулж чадсангүй — хаягийн мөрөөс гараар хуулна уу.'
          : note
            ? note
            : 'Story-д захидал, зураг, баглаа урсаж харагдана.'}
      </p>
    </div>
  )
}
