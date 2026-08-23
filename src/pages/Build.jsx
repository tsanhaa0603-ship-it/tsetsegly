import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import StepIndicator from '../components/builder/StepIndicator'
import Step1Flowers from '../components/builder/Step1Flowers'
import Step2Wrapping from '../components/builder/Step2Wrapping'
import Step3Ribbon from '../components/builder/Step3Ribbon'
import Step4Delivery from '../components/builder/Step4Delivery'
import Step5Summary from '../components/builder/Step4Summary'
import { fetchFlowers, fetchWrappings, fetchShapes } from '../lib/api'
import { DEFAULT_CATALOG, calcTotal } from '../lib/flowers'
import { DEFAULT_WRAPPINGS } from '../lib/wrappings'
import { DEFAULT_SHAPES } from '../lib/shapes'

const TOTAL_STEPS = 5

export default function Build() {
  const location = useLocation()
  // Бэлэн баглаанаас ирсэн тохиргоо (байвал)
  const preset = location.state?.preset
  const [step, setStep] = useState(location.state?.startStep || 1)
  const [catalog, setCatalog] = useState(DEFAULT_CATALOG)
  const [wrappings, setWrappings] = useState(DEFAULT_WRAPPINGS)
  const [shapes, setShapes] = useState(DEFAULT_SHAPES)

  // Цэцгийн каталогийг backend-аас татна (амжилтгүй бол default)
  useEffect(() => {
    let active = true
    fetchFlowers().then((c) => { if (active) setCatalog(c) })
    fetchWrappings().then((w) => { if (active) setWrappings(w) })
    fetchShapes().then((s) => { if (active) setShapes(s) })
    return () => { active = false }
  }, [])
  const [order, setOrder] = useState(() => ({
    flowers: preset?.flowers || {},  // { 'flowerKey:colorKey': qty }
    shape: preset?.shape || null,    // bouquet shape id
    wrapping: preset?.wrapping || null, // wrapping id
    ribbon: preset?.ribbon || null,  // ribbon id
    name: '',
    phone: '',
    delivery: {       // хүргэлтийн мэдээлэл
      zone: '',
      address: '',
      note: '',
      recipientName: '',
      recipientPhone: '',
      surprise: false,
      date: '',
      slot: '',
    },
    gift: {           // дижитал бэлгийн хуудасны агуулга
      recipientName: '',
      letterText: '',
      letterFont: 'elegant',
      musicUrl: '',
      photos: [],
      nfcText: '',      // NFC chip-д бичих мэндчилгээ
    },
  }))

  // Алхам солигдох бүрт дэлгэцийг дээрээс эхлүүлнэ (route өөрчлөгддөггүй тул ScrollToTop ажиллахгүй)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  // Хүргэлт үнэгүй болох босгыг шалгахад цэцэг + боолтын дүн хэрэгтэй
  const subtotal =
    calcTotal(order.flowers, catalog) +
    (wrappings.find((w) => w.id === order.wrapping)?.price || 0)

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  const prev = () => setStep((s) => Math.max(s - 1, 1))

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20 px-4">
      <div className={`mx-auto ${step === 1 || step === 2 ? 'max-w-5xl' : 'max-w-3xl'}`}>
        {/* Page title */}
        <div className="text-center mb-10">
          <p className="font-cormorant tracking-[0.4em] text-xs uppercase text-gold-dark/60 mb-2">
            Өөрийн гараар
          </p>
          <h1 className="font-playfair italic text-4xl md:text-5xl text-ink">
            Баглаа бүтээх
          </h1>
          <div
            className="w-16 h-px mx-auto mt-4"
            style={{ background: 'linear-gradient(90deg, transparent, #C9A961, transparent)' }}
          />
        </div>

        {/* Step indicator */}
        <StepIndicator current={step} total={TOTAL_STEPS} />

        {/* Step content */}
        <div className="mt-8">
          {step === 1 && (
            <Step1Flowers
              catalog={catalog}
              selected={order.flowers}
              onChange={(flowers) => setOrder((o) => ({ ...o, flowers }))}
              onNext={next}
            />
          )}
          {step === 2 && (
            <Step2Wrapping
              selectedShape={order.shape}
              onChangeShape={(shape) => setOrder((o) => ({ ...o, shape }))}
              selected={order.wrapping}
              onChange={(wrapping) => setOrder((o) => ({ ...o, wrapping }))}
              wrappings={wrappings}
              shapes={shapes}
              onNext={next}
              onPrev={prev}
            />
          )}
          {step === 3 && (
            <Step3Ribbon
              selectedRibbon={order.ribbon}
              onChangeRibbon={(ribbon) => setOrder((o) => ({ ...o, ribbon }))}
              gift={order.gift}
              onChangeGift={(gift) => setOrder((o) => ({ ...o, gift }))}
              onNext={next}
              onPrev={prev}
            />
          )}
          {step === 4 && (
            <Step4Delivery
              delivery={order.delivery}
              onChange={(delivery) => setOrder((o) => ({ ...o, delivery }))}
              giftRecipientName={order.gift?.recipientName}
              subtotal={subtotal}
              onNext={next}
              onPrev={prev}
            />
          )}
          {step === 5 && (
            <Step5Summary
              order={order}
              catalog={catalog}
              wrappings={wrappings}
              shapes={shapes}
              onChange={(fields) => setOrder((o) => ({ ...o, ...fields }))}
              onPrev={prev}
            />
          )}
        </div>
      </div>
    </div>
  )
}
