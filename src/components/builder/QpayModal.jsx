import { useState, useEffect, useRef } from 'react'
import { createQpayInvoice, fetchPaymentStatus } from '../../lib/api'

/* ─────────────────────────────────────────────────────────────
   QPay төлбөрийн modal.

   - Нээгдэнгүүт backend-аас нэхэмжлэх (QR + банкны deeplink) үүсгэнэ
   - Компьютерт QR код, гар утсанд банкны deeplink товчнууд
   - 3 секунд тутамд төлбөрийн статус шалгана
   - Төлбөр амжсанд onPaid() дуудна
   - 5 минутын дараа timeout

   Props: { orderId, amount, onPaid, onClose }
───────────────────────────────────────────────────────────── */

const POLL_MS = 3000
const TIMEOUT_MS = 5 * 60 * 1000

function fmt(n) {
  return '₮' + Number(n || 0).toLocaleString('mn-MN')
}

const isMobile = () =>
  typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

export default function QpayModal({ orderId, amount, onPaid, onClose }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [invoice, setInvoice] = useState(null)   // { qrImage, qrText, urls }
  const [timedOut, setTimedOut] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const mobile = isMobile()

  // ── Нэхэмжлэх үүсгэх ──
  useEffect(() => {
    let active = true

    createQpayInvoice(orderId)
      .then((data) => {
        if (!active) return
        if (data.alreadyPaid) { onPaid(); return }
        setInvoice(data)
      })
      .catch((e) => { if (active) setError(e.message || 'Алдаа гарлаа') })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [orderId, reloadKey, onPaid])

  // ── Төлбөрийн статус polling ──
  const paidRef = useRef(false)
  useEffect(() => {
    if (!invoice || timedOut) return
    let active = true
    const startedAt = Date.now()

    const tick = async () => {
      if (!active || paidRef.current) return
      // Timeout шалгах
      if (Date.now() - startedAt > TIMEOUT_MS) {
        if (active) setTimedOut(true)
        return
      }
      try {
        const s = await fetchPaymentStatus(orderId)
        if (active && s.paymentStatus === 'paid') {
          paidRef.current = true
          onPaid()
        }
      } catch {
        // Сүлжээний түр алдааг үл тоомсорлоно — дараагийн tick дахин оролдоно
      }
    }

    const id = setInterval(tick, POLL_MS)
    tick() // эхний шалгалтыг шууд хийнэ
    return () => { active = false; clearInterval(id) }
  }, [invoice, timedOut, orderId, onPaid])

  function retry() {
    setInvoice(null)
    setError('')
    setTimedOut(false)
    setLoading(true)
    paidRef.current = false
    setReloadKey((k) => k + 1)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(40, 30, 20, 0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-gold-light/80 overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(160deg, #FEFCF7, #FAF7F2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-ink/40 hover:text-ink/80 hover:bg-gold-light/40 transition-colors"
          aria-label="Хаах"
        >
          ✕
        </button>

        {/* Header */}
        <div className="px-6 pt-7 pb-4 text-center">
          <p className="font-cormorant tracking-[0.3em] text-xs uppercase text-gold-dark/70 mb-1">
            QPay төлбөр
          </p>
          <h3 className="font-playfair italic text-2xl text-ink">{fmt(amount)}</h3>
          <div
            className="w-12 h-px mx-auto mt-3"
            style={{ background: 'linear-gradient(90deg,transparent,#C9A961,transparent)' }}
          />
        </div>

        {/* Body */}
        <div className="px-6 pb-7">
          {/* Loading */}
          {loading && (
            <div className="py-12 flex flex-col items-center gap-4">
              <Spinner />
              <p className="font-cormorant text-ink/50">Нэхэмжлэх үүсгэж байна…</p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="py-8 text-center">
              <p className="text-3xl mb-3">⚠</p>
              <p className="font-cormorant text-base text-ink/70 mb-5">{error}</p>
              <button
                onClick={retry}
                className="px-6 py-2.5 rounded-xl font-cormorant text-sm tracking-wide uppercase text-cream"
                style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}
              >
                Дахин оролдох
              </button>
            </div>
          )}

          {/* Timeout */}
          {!loading && !error && timedOut && (
            <div className="py-8 text-center">
              <p className="text-3xl mb-3">⏳</p>
              <p className="font-cormorant text-base text-ink/70 mb-5">
                Хугацаа дууссан. Дахин оролдоно уу.
              </p>
              <button
                onClick={retry}
                className="px-6 py-2.5 rounded-xl font-cormorant text-sm tracking-wide uppercase text-cream"
                style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}
              >
                Дахин оролдох
              </button>
            </div>
          )}

          {/* Invoice ready */}
          {!loading && !error && !timedOut && invoice && (
            <>
              {/* QR — компьютерт төв, утсанд жижиг */}
              {invoice.qrImage && (
                <div className="flex flex-col items-center mb-5">
                  <div className="p-3 bg-white rounded-2xl border border-gold-light/60 shadow-sm">
                    <img
                      src={
                        invoice.qrImage.startsWith('data:')
                          ? invoice.qrImage
                          : `data:image/png;base64,${invoice.qrImage}`
                      }
                      alt="QPay QR код"
                      className="w-44 h-44 object-contain"
                    />
                  </div>
                  {!mobile && (
                    <p className="font-cormorant text-sm text-ink/50 mt-3 text-center">
                      Банкны аппаа нээж QR кодыг уншуулна уу
                    </p>
                  )}
                </div>
              )}

              {/* Банк сонгох */}
              {invoice.urls?.length > 0 && (
                <div>
                  <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 mb-3 text-center">
                    {mobile ? 'Банкаа сонгоно уу' : 'Эсвэл банкаа сонгоно уу'}
                  </p>
                  <div className="grid grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                    {invoice.urls.map((b) => (
                      <a
                        key={b.name}
                        href={b.link}
                        target={mobile ? undefined : '_blank'}
                        rel="noreferrer"
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-gold-light/60 bg-white/60 hover:bg-gold-light/30 hover:border-gold-mid/50 transition-colors"
                        title={b.description || b.name}
                      >
                        {b.logo ? (
                          <img src={b.logo} alt={b.name} className="w-8 h-8 rounded-lg object-contain" />
                        ) : (
                          <span className="w-8 h-8 flex items-center justify-center text-lg">🏦</span>
                        )}
                        <span className="font-cormorant text-[10px] leading-tight text-ink/60 text-center line-clamp-2">
                          {b.description || b.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Хүлээж байна */}
              <div className="mt-6 flex items-center justify-center gap-2.5 py-3 rounded-xl bg-gold-light/25 border border-gold-light/50">
                <Spinner small />
                <span className="font-cormorant text-sm text-gold-dark">
                  Төлбөр хүлээгдэж байна…
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function Spinner({ small }) {
  const size = small ? 18 : 36
  return (
    <span
      className="inline-block rounded-full animate-spin"
      style={{
        width: size,
        height: size,
        border: `${small ? 2 : 3}px solid rgba(201,169,97,0.25)`,
        borderTopColor: '#C9A961',
      }}
    />
  )
}
