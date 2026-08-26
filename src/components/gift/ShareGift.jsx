import { useState } from 'react'
import { trackGiftShared } from '../../lib/analytics'
import { buildStoryImage, blobToFile } from '../../lib/storyImage'

/* ─────────────────────────────────────────────
   Бэлгийн хуудсыг хуваалцах

   Тархалтын гогцоо: хүлээн авагч хуудсаа Story-доо эсвэл
   найздаа явуулна → шинэ хүн Tsetsegly-г хардаг → доорх
   «өөрөө бүтээх» товчоор захиалагч болно. Зарын төсөвгүй хүрээ.

   ЧУХАЛ: Facebook, Instagram-ын Story нь ЗӨВХӨН зураг/бичлэг
   хүлээж авдаг — холбоос хүлээж авдаггүй. Тиймээс Story-д
   хуваалцахын тулд navigator.share-т ЗУРАГ дамжуулна.
   Тэгж байж хуваалцах цэсэнд "Story" сонголт гарч ирдэг.

   Хувийн нууц: зурган дээр захидлын текст, хувийн зураг
   ОРУУЛАХГҮЙ — зөвхөн мэдэгдэл, нэр, брэнд харагдана.
───────────────────────────────────────────── */
export default function ShareGift({ senderName, recipientName }) {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)
  const [busy, setBusy] = useState(false)
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

  /* Story-д хуваалцах — зураг үүсгээд файлаар дамжуулна */
  async function shareStory() {
    setBusy(true)
    setNote('')
    try {
      const blob = await buildStoryImage({
        recipientName,
        senderName,
        siteUrl: typeof window !== 'undefined' ? window.location.host : 'tsetsegly.mn',
      })
      if (!blob) throw new Error('no blob')
      const file = blobToFile(blob)

      // Хөтөч файл хуваалцахыг дэмжиж байвал системийн цэс нээнэ
      if (canShareFiles && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText })
        trackGiftShared('story')
        setNote('Хуваалцах цэснээс Instagram эсвэл Facebook → Story сонгоно уу.')
        return
      }

      // Дэмжихгүй бол зургийг татаж өгнө — гараар Story-доо тавина
      downloadBlob(blob)
      trackGiftShared('story_download')
      setNote('Зураг татагдлаа — Story-доо оруулаад хуваалцаарай.')
    } catch (e) {
      if (e?.name === 'AbortError') return   // хэрэглэгч цуцалсан
      setNote('Зураг үүсгэж чадсангүй. Холбоосыг хуулж хуваалцана уу.')
    } finally {
      setBusy(false)
    }
  }

  function downloadBlob(blob) {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'tsetsegly-beleg.png'
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
          <span className="relative text-ink font-medium flex items-center justify-center gap-2">
            <span aria-hidden="true">📸</span>
            {busy ? 'Зураг бэлдэж байна…' : 'Story-д хуваалцах'}
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
            : 'Story-д зураг тавигдана — захидал тань нууц хэвээр. Холбоосыг нээсэн хүн захидал, зургийг тань харна.'}
      </p>
    </div>
  )
}
