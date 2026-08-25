import { useState } from 'react'
import { trackGiftShared } from '../../lib/analytics'

/* ─────────────────────────────────────────────
   Бэлгийн хуудсыг хуваалцах

   Тархалтын гогцоо: хүлээн авагч хуудсаа Story-доо эсвэл
   найздаа явуулна → шинэ хүн Tsetsegly-г хардаг → доорх
   «өөрөө бүтээх» товчоор захиалагч болно. Зарын төсөвгүй хүрээ.

   Утсан дээр navigator.share нь Instagram, Messenger, Viber зэрэг
   бүх апп бүхий системийн хуваалцах цэсийг нээнэ. Компьютер дээр
   эсвэл дэмжихгүй үед холбоос хуулах хувилбар руу шилжинэ.

   Хуудас хувийн захидал, зураг агуулдаг тул юу хуваалцаж байгааг
   товчны доор ил бичнэ — хүлээн авагч мэдсээр байж шийднэ.
───────────────────────────────────────────── */
export default function ShareGift({ senderName }) {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)

  const url = typeof window !== 'undefined' ? window.location.href : ''
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

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

  async function share() {
    if (!canShare) return copyLink()
    try {
      await navigator.share({
        title: 'Танд зориулсан бэлэг',
        text: senderName
          ? `${senderName}-аас надад ийм бэлэг ирлээ 💐`
          : 'Надад ийм бэлэг ирлээ 💐',
        url,
      })
      trackGiftShared('native')
    } catch (e) {
      /* Хэрэглэгч цэсийг хаасан бол алдаа биш — чимээгүй өнгөрнө */
      if (e?.name !== 'AbortError') copyLink()
    }
  }

  return (
    <div className="text-center">
      <div className="flex flex-col sm:flex-row gap-2.5 justify-center items-stretch max-w-sm mx-auto">
        <button
          onClick={share}
          className="group relative flex-1 px-6 py-3 font-cormorant text-sm tracking-widest uppercase overflow-hidden rounded-xl"
        >
          <span
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #F4EBD3, #C9A961, #8A6E2F)' }}
          />
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(135deg, #8A6E2F, #C9A961, #F4EBD3)' }}
          />
          {/* Товч яг юу хийхээ хэлнэ. Утсан дээр хуваалцах цэс нээгдэнэ,
              компьютер дээр холбоос хуулагдана — нэрийг нь тааруулна. */}
          <span className="relative text-ink font-medium flex items-center justify-center gap-2">
            <span aria-hidden="true">💌</span>
            {canShare ? 'Хуваалцах' : copied ? '✓ Хууллаа' : 'Холбоос хуулах'}
          </span>
        </button>

        {canShare && (
          <button
            onClick={copyLink}
            className="flex-1 px-6 py-3 font-cormorant text-sm tracking-widest uppercase rounded-xl border border-gold-mid/40 text-ink/70 hover:bg-gold-light/30 hover:text-ink transition-colors"
          >
            {copied ? '✓ Хууллаа' : 'Холбоос хуулах'}
          </button>
        )}
      </div>

      {/* Тайлбар — юу хуваалцаж байгааг ил хэлнэ */}
      <p
        className="font-cormorant text-xs text-ink/40 mt-3 max-w-xs mx-auto leading-relaxed"
        aria-live="polite"
      >
        {failed
          ? 'Хуулж чадсангүй — хаягийн мөрөөс гараар хуулна уу.'
          : 'Холбоосыг нээсэн хүн захидал, зургийг тань харна.'}
      </p>
    </div>
  )
}
