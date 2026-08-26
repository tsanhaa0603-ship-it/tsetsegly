import { useState } from 'react'
import { trackGiftShared } from '../../lib/analytics'
import { buildStoryImage, blobToFile } from '../../lib/storyImage'
import { buildStoryVideo, videoToFile, canRecordVideo } from '../../lib/storyVideo'

/* ─────────────────────────────────────────────
   Бэлгийн хуудсыг хуваалцах

   Тархалтын гогцоо: хүлээн авагч хуудсаа Story-доо эсвэл
   найздаа явуулна → шинэ хүн Tsetsegly-г хардаг → доорх
   «өөрөө бүтээх» товчоор захиалагч болно. Зарын төсөвгүй хүрээ.

   ЧУХАЛ: Facebook, Instagram-ын Story нь ЗӨВХӨН зураг/бичлэг
   хүлээж авдаг — холбоос хүлээж авдаггүй. Тиймээс Story-д
   хуваалцахын тулд navigator.share-т ФАЙЛ дамжуулна.
   Тэгж байж хуваалцах цэсэнд "Story" сонголт гарч ирдэг.

   Story дээр мэндчилгээний бүх зүйл (захидал, зураг, баглаа)
   эрэмблэн урсдаг бичлэг үүснэ. Бичлэг дэмжихгүй хөтөч дээр
   энгийн зураг руу шилжинэ.
───────────────────────────────────────────── */
export default function ShareGift({
  senderName, recipientName, letterText, photos, flowers, shapeName, wrapName,
}) {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [note, setNote] = useState('')

  const url = typeof window !== 'undefined' ? window.location.href : ''
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  const canShareFiles =
    canShare && typeof navigator.canShare === 'function'

  const shareText = senderName
    ? `${senderName}-аас надад ийм бэлэг ирлээ 💐`
    : 'Надад ийм бэлэг ирлээ 💐'

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      /* Хуучин хөтөч дээр clipboard API байхгүй */
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

  /* Story-д хуваалцах — мэндчилгээний бүх зүйл урсдаг бичлэг үүсгэнэ.
     Бичлэг боломжгүй хөтөч дээр зураг руу шилжинэ. */
  async function shareStory() {
    setBusy(true)
    setNote('')
    setProgress(0)
    const host = typeof window !== 'undefined' ? window.location.host : 'tsetsegly.mn'

    try {
      let file, kind

      if (canRecordVideo()) {
        setNote('Бичлэг бэлдэж байна… (~15 сек)')
        const { blob, ext } = await buildStoryVideo({
          recipientName, senderName, letterText, photos, flowers,
          shapeName, wrapName, siteUrl: host,
          onProgress: setProgress,
        })
        if (!blob || !blob.size) throw new Error('empty video')
        file = videoToFile(blob, ext)
        kind = 'video'
      } else {
        const blob = await buildStoryImage({ recipientName, senderName, siteUrl: host })
        if (!blob) throw new Error('no blob')
        file = blobToFile(blob)
        kind = 'image'
      }

      // Хөтөч файл хуваалцахыг дэмжиж байвал системийн цэс нээнэ
      if (canShareFiles && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText })
        trackGiftShared(kind === 'video' ? 'story_video' : 'story')
        setNote('Хуваалцах цэснээс Instagram эсвэл Facebook → Story сонгоно уу.')
        return
      }

      // Дэмжихгүй бол татаж өгнө — гараар Story-доо тавина
      downloadFile(file)
      trackGiftShared(kind === 'video' ? 'story_video_download' : 'story_download')
      setNote(kind === 'video'
        ? 'Бичлэг татагдлаа — Story-доо оруулаад хуваалцаарай.'
        : 'Зураг татагдлаа — Story-доо оруулаад хуваалцаарай.')
    } catch (e) {
      if (e?.name === 'AbortError') return   // хэрэглэгч цуцалсан
      // Бичлэг бүтэлгүйтвэл зургаар оролдоно
      try {
        const blob = await buildStoryImage({ recipientName, senderName, siteUrl: host })
        const f = blobToFile(blob)
        if (canShareFiles && navigator.canShare({ files: [f] })) {
          await navigator.share({ files: [f], text: shareText })
          trackGiftShared('story')
          setNote('Хуваалцах цэснээс Instagram эсвэл Facebook → Story сонгоно уу.')
        } else {
          downloadFile(f)
          setNote('Зураг татагдлаа — Story-доо оруулаад хуваалцаарай.')
        }
      } catch {
        setNote('Үүсгэж чадсангүй. Холбоосыг хуулж хуваалцана уу.')
      }
    } finally {
      setBusy(false)
      setProgress(0)
    }
  }

  function downloadFile(fileOrBlob) {
    const a = document.createElement("a")
    a.href = URL.createObjectURL(fileOrBlob)
    a.download = fileOrBlob.name || "tsetsegly-beleg.png"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(a.href), 4000)
  }

  return (
    <div className="text-center">
      <div className="flex flex-col gap-2.5 max-w-sm mx-auto">
        {/* Story — зураг болгож хуваалцана */}
        <button
          onClick={shareStory}
          disabled={busy}
          className={`group relative px-6 py-3.5 font-cormorant text-sm tracking-widest uppercase overflow-hidden rounded-xl ${busy ? 'opacity-70 cursor-wait' : ''}`}
        >
          <span
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #F4EBD3, #C9A961, #8A6E2F)' }}
          />
          {!busy && (
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, #8A6E2F, #C9A961, #F4EBD3)' }}
            />
          )}
          {/* Явцын заалт — бичлэг бэлдэх хугацаанд */}
          {busy && progress > 0 && (
            <span
              className="absolute inset-y-0 left-0 transition-all duration-150"
              style={{ width: `${Math.round(progress * 100)}%`, background: 'rgba(255,255,255,0.35)' }}
            />
          )}
          <span className="relative text-ink font-medium flex items-center justify-center gap-2">
            <span aria-hidden="true">🎬</span>
            {busy
              ? `Бичлэг бэлдэж байна… ${progress > 0 ? Math.round(progress * 100) + '%' : ''}`
              : 'Story-д хуваалцах'}
          </span>
        </button>

        <div className="flex gap-2.5">
          {/* Холбоос — Messenger, мессежээр илгээх */}
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

      {/* Тайлбар — юу хуваалцаж байгааг ил хэлнэ */}
      <p
        className="font-cormorant text-xs text-ink/40 mt-3 max-w-xs mx-auto leading-relaxed"
        aria-live="polite"
      >
        {failed
          ? 'Хуулж чадсангүй — хаягийн мөрөөс гараар хуулна уу.'
          : note
            ? note
            : 'Story-д захидал, зураг, баглаа урсаж харагдана. Холбоосыг нээсэн хүн бүх зүйлийг тань харна.'}
      </p>
    </div>
  )
}
