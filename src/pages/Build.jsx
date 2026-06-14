import { useState, useEffect } from 'react'
import StepIndicator from '../components/builder/StepIndicator'
import Step1Flowers from '../components/builder/Step1Flowers'
import Step2Wrapping from '../components/builder/Step2Wrapping'
import Step3Ribbon from '../components/builder/Step3Ribbon'
import Step4Summary from '../components/builder/Step4Summary'
import { fetchFlowers } from '../lib/api'
import { DEFAULT_CATALOG } from '../lib/flowers'

const TOTAL_STEPS = 4

export default function Build() {
  const [step, setStep] = useState(1)
  const [catalog, setCatalog] = useState(DEFAULT_CATALOG)

  // Цэцгийн каталогийг backend-аас татна (амжилтгүй бол default)
  useEffect(() => {
    let active = true
    fetchFlowers().then((c) => { if (active) setCatalog(c) })
    return () => { active = false }
  }, [])
  const [order, setOrder] = useState({
    flowers: {},      // { id: quantity }
    shape: null,      // bouquet shape id
    wrapping: null,   // wrapping id
    ribbon: null,     // ribbon id
    name: '',
    phone: '',
    gift: {           // дижитал бэлгийн хуудасны агуулга
      recipientName: '',
      letterText: '',
      letterFont: 'elegant',
      musicUrl: '',
      photos: [],
      nfcText: '',      // NFC chip-д бичих мэндчилгээ
    },
  })

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  const prev = () => setStep((s) => Math.max(s - 1, 1))

  return (
    <div className="min-h-screen bg-cream pt-24 pb-20 px-4">
      <div className={`mx-auto ${step === 1 ? 'max-w-5xl' : 'max-w-3xl'}`}>
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
            <Step4Summary
              order={order}
              catalog={catalog}
              onChange={(fields) => setOrder((o) => ({ ...o, ...fields }))}
              onPrev={prev}
            />
          )}
        </div>
      </div>
    </div>
  )
}
