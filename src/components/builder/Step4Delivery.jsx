import { useEffect, useMemo, useState } from 'react'
import WizardNav from './WizardNav'
import {
  ALL_ZONES,
  TIME_SLOTS,
  FREE_DELIVERY_MIN,
  calcDeliveryFee,
  earliestDate,
  latestDate,
  formatDate,
  isSameDayAvailable,
  validateDelivery,
} from '../../lib/delivery'

function fmt(n) {
  return '₮' + Number(n || 0).toLocaleString('mn-MN')
}

/* Алхам 4 — Хүргэлтийн мэдээлэл
   Салбар дэлгүүргүй тул хүргэлт бол цорын ганц хүлээн авах арга. */
export default function Step4Delivery({ delivery, onChange, giftRecipientName, subtotal, onNext, onPrev }) {
  const [errors, setErrors] = useState({})

  const minDate = useMemo(() => earliestDate(), [])
  const maxDate = useMemo(() => latestDate(), [])
  const sameDay = useMemo(() => isSameDayAvailable(), [])

  const dv = delivery || {}
  const { fee, free, negotiable } = calcDeliveryFee(dv.zone, subtotal)

  /* Талбар шинэчлэх — тухайн талбарын алдааг цэвэрлэнэ */
  function set(field, value) {
    onChange({ ...dv, [field]: value })
    setErrors((e) => ({ ...e, [field]: '' }))
  }

  /* Алхам 3-т бэлгийн хуудсанд хүлээн авагчийн нэр бичсэн бол урьдчилж бөглөнө */
  useEffect(() => {
    if (!dv.recipientName && giftRecipientName) {
      onChange({ ...dv, recipientName: giftRecipientName })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [giftRecipientName])

  /* Огноог хамгийн эрт боломжит өдрөөр эхлүүлнэ */
  useEffect(() => {
    if (!dv.date) onChange({ ...dv, date: minDate })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleNext() {
    const e = validateDelivery(dv)
    if (Object.keys(e).length) {
      setErrors(e)
      // Эхний алдаатай талбар руу гүйлгэнэ
      const first = document.querySelector('[data-error="true"]')
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    onNext()
  }

  const inputBase =
    'w-full rounded-xl border px-4 py-2.5 font-cormorant text-base text-ink placeholder-ink/30 bg-white/60 focus:outline-none transition-colors'
  const inputOk = 'border-gold-light/80 focus:border-gold-mid'
  const inputBad = 'border-red-300'

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-playfair italic text-2xl text-ink">Хүргэлт</h2>
        <p className="font-cormorant text-ink/50 mt-0.5">
          Бид салбар дэлгүүргүй — баглаагаа шууд хаягт нь хүргэж өгнө
        </p>
      </div>

      {/* ── Бүс сонголт ── */}
      <div
        className="rounded-2xl border border-gold-light/80 px-5 py-5 mb-4"
        style={{ background: 'linear-gradient(160deg, #FEFCF7, #FAF7F2)' }}
        data-error={errors.zone ? 'true' : undefined}
      >
        <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 mb-3">
          Хүргэлтийн бүс
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {ALL_ZONES.map((z) => {
            const active = dv.zone === z.id
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => set('zone', z.id)}
                className={`text-left rounded-xl border px-4 py-3 transition-all duration-200 ${
                  active
                    ? 'border-gold-mid shadow-sm'
                    : 'border-gold-light/70 hover:border-gold-mid/60'
                }`}
                style={active ? { background: 'linear-gradient(135deg, #F4EBD3, #FEF8EC)' } : { background: '#FFFDF8' }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-cormorant text-base text-ink">{z.name}</span>
                  <span className="font-cormorant text-sm text-gold-dark whitespace-nowrap">
                    {z.fee === null ? 'Тохиролцоно' : fmt(z.fee)}
                  </span>
                </div>
                <p className="font-cormorant text-xs text-ink/40 mt-0.5">{z.eta}</p>
              </button>
            )
          })}
        </div>

        {errors.zone && <p className="font-cormorant text-xs text-red-400 mt-2">{errors.zone}</p>}

        {/* Үнэгүй хүргэлтийн мэдэгдэл */}
        {free ? (
          <p className="font-cormorant text-sm text-gold-dark mt-3">
            ✓ {fmt(FREE_DELIVERY_MIN)}-аас дээш захиалга — хүргэлт үнэгүй
          </p>
        ) : negotiable ? (
          <p className="font-cormorant text-sm text-ink/50 mt-3">
            Энэ бүсэд хүргэлтийн төлбөрийг захиалга баталгаажсаны дараа утсаар тохирно.
          </p>
        ) : (
          subtotal > 0 && subtotal < FREE_DELIVERY_MIN && (
            <p className="font-cormorant text-sm text-ink/50 mt-3">
              Дахиад {fmt(FREE_DELIVERY_MIN - subtotal)} нэмбэл хүргэлт үнэгүй болно.
            </p>
          )
        )}
      </div>

      {/* ── Хаяг ── */}
      <div className="rounded-2xl border border-gold-light/80 px-5 py-5 mb-4 bg-white/40">
        <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 mb-4">
          Хүргэх хаяг
        </p>

        <div className="flex flex-col gap-4">
          <div data-error={errors.address ? 'true' : undefined}>
            <label className="font-cormorant text-sm text-ink/60 mb-1 block">
              Дэлгэрэнгүй хаяг
            </label>
            <textarea
              value={dv.address || ''}
              onChange={(e) => set('address', e.target.value)}
              rows={3}
              placeholder="Хороо, гудамж, байрны нэр, орц, тоот"
              className={`${inputBase} resize-none ${errors.address ? inputBad : inputOk}`}
            />
            {errors.address && (
              <p className="font-cormorant text-xs text-red-400 mt-1">{errors.address}</p>
            )}
          </div>

          <div>
            <label className="font-cormorant text-sm text-ink/60 mb-1 block">
              Орцны код, чиглүүлэг <span className="text-ink/30">(заавал биш)</span>
            </label>
            <input
              type="text"
              value={dv.note || ''}
              onChange={(e) => set('note', e.target.value)}
              placeholder="Жишээ: орцны код 1234, 3 давхар"
              className={`${inputBase} ${inputOk}`}
            />
          </div>
        </div>
      </div>

      {/* ── Хүлээн авагч ── */}
      <div className="rounded-2xl border border-gold-light/80 px-5 py-5 mb-4 bg-white/40">
        <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 mb-4">
          Хүлээн авагч
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div data-error={errors.recipientName ? 'true' : undefined}>
            <label className="font-cormorant text-sm text-ink/60 mb-1 block">Нэр</label>
            <input
              type="text"
              value={dv.recipientName || ''}
              onChange={(e) => set('recipientName', e.target.value)}
              placeholder="Хэнд хүргэх вэ"
              className={`${inputBase} ${errors.recipientName ? inputBad : inputOk}`}
            />
            {errors.recipientName && (
              <p className="font-cormorant text-xs text-red-400 mt-1">{errors.recipientName}</p>
            )}
          </div>

          <div data-error={errors.recipientPhone ? 'true' : undefined}>
            <label className="font-cormorant text-sm text-ink/60 mb-1 block">Утасны дугаар</label>
            <input
              type="tel"
              value={dv.recipientPhone || ''}
              onChange={(e) => set('recipientPhone', e.target.value.replace(/\D/g, ''))}
              placeholder="8 оронтой дугаар"
              maxLength={8}
              className={`${inputBase} ${errors.recipientPhone ? inputBad : inputOk}`}
            />
            {errors.recipientPhone && (
              <p className="font-cormorant text-xs text-red-400 mt-1">{errors.recipientPhone}</p>
            )}
          </div>
        </div>

        {/* Гэнэтийн бэлэг */}
        <label className="flex items-start gap-3 mt-4 cursor-pointer group">
          <input
            type="checkbox"
            checked={!!dv.surprise}
            onChange={(e) => set('surprise', e.target.checked)}
            className="mt-1 w-4 h-4 accent-[#C9A961] cursor-pointer"
          />
          <span className="font-cormorant text-sm text-ink/60 group-hover:text-ink/80 transition-colors">
            Гэнэтийн бэлэг — хүлээн авагчид урьдчилж бүү залгаарай.
            <span className="block text-xs text-ink/35 mt-0.5">
              Хаалганы өмнө очоод залгана. Хэрэв гэрт байхгүй бол таны дугаарт мэдэгдэнэ.
            </span>
          </span>
        </label>
      </div>

      {/* ── Огноо, цаг ── */}
      <div className="rounded-2xl border border-gold-light/80 px-5 py-5 mb-2 bg-white/40">
        <p className="font-cormorant tracking-widest text-xs uppercase text-ink/40 mb-4">
          Хүргэх хугацаа
        </p>

        <div data-error={errors.date ? 'true' : undefined}>
          <label className="font-cormorant text-sm text-ink/60 mb-1 block">Огноо</label>
          <input
            type="date"
            value={dv.date || ''}
            min={minDate}
            max={maxDate}
            onChange={(e) => set('date', e.target.value)}
            className={`${inputBase} ${errors.date ? inputBad : inputOk}`}
          />
          {dv.date && !errors.date && (
            <p className="font-cormorant text-xs text-gold-dark mt-1">{formatDate(dv.date)}</p>
          )}
          {errors.date && <p className="font-cormorant text-xs text-red-400 mt-1">{errors.date}</p>}
          {!sameDay && (
            <p className="font-cormorant text-xs text-ink/40 mt-1.5">
              18:00 цаг өнгөрсөн тул өнөөдрийн хүргэлт хаагдсан. Хамгийн эрт нь маргааш.
            </p>
          )}
        </div>

        <div className="mt-4" data-error={errors.slot ? 'true' : undefined}>
          <label className="font-cormorant text-sm text-ink/60 mb-2 block">Цагийн хуваарь</label>
          <div className="grid grid-cols-2 gap-2.5">
            {TIME_SLOTS.map((s) => {
              const active = dv.slot === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => set('slot', s.id)}
                  className={`rounded-xl border px-4 py-2.5 text-left transition-all duration-200 ${
                    active ? 'border-gold-mid shadow-sm' : 'border-gold-light/70 hover:border-gold-mid/60'
                  }`}
                  style={active ? { background: 'linear-gradient(135deg, #F4EBD3, #FEF8EC)' } : { background: '#FFFDF8' }}
                >
                  <span className="font-cormorant text-base text-ink block leading-tight">{s.label}</span>
                  <span className="font-cormorant text-xs text-ink/40">{s.hint}</span>
                </button>
              )
            })}
          </div>
          {errors.slot && <p className="font-cormorant text-xs text-red-400 mt-2">{errors.slot}</p>}
        </div>
      </div>

      {/* Хүргэлтийн төлбөрийн хураангуй */}
      {dv.zone && (
        <div
          className="rounded-xl px-5 py-3 flex items-center justify-between mb-2"
          style={{ background: 'linear-gradient(135deg, #F4EBD3 0%, #FEF8EC 100%)' }}
        >
          <span className="font-cormorant text-base text-ink">Хүргэлтийн төлбөр</span>
          <span className="font-playfair text-lg text-ink">
            {negotiable ? 'Тохиролцоно' : free ? 'Үнэгүй' : fmt(fee)}
          </span>
        </div>
      )}

      <WizardNav onPrev={onPrev} onNext={handleNext} nextLabel="Хураангуй харах →" />
    </div>
  )
}
