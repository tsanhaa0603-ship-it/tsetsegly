/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react'
import WizardNav from './WizardNav'
import { LETTER_FONTS } from '../../lib/letterFonts'
import { parseMediaUrl } from '../../lib/mediaEmbed'
import { fileToCompressedDataUrl } from '../../lib/imageUtils'

export const RIBBONS = [
  { id: 'gold',   name: 'Алтан',    color: '#C9A961', accent: '#8A6E2F' },
  { id: 'blush',  name: 'Ягаан',    color: '#F2A8B8', accent: '#C4768A' },
  { id: 'ivory',  name: 'Цагаан',   color: '#F5EFE0', accent: '#C9B99A' },
  { id: 'forest', name: 'Ногоон',   color: '#6A9950', accent: '#3D6B2C' },
  { id: 'black',  name: 'Хар',      color: '#2A2A2A', accent: '#C9A961' },
]

const MAX_PHOTOS = 5

/* ── Section wrapper ── */
function Section({ icon, title, hint, children }) {
  return (
    <div className="rounded-2xl border border-gold-light/70 bg-white/40 p-5">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl leading-none">{icon}</span>
        <div>
          <h3 className="font-playfair italic text-xl text-ink leading-tight">{title}</h3>
          {hint && <p className="font-cormorant text-sm text-ink/45 mt-0.5">{hint}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

export default function Step3Ribbon({
  selectedRibbon, onChangeRibbon,
  gift, onChangeGift,
  onNext, onPrev,
}) {
  const [photoError, setPhotoError] = useState('')
  const [uploading, setUploading] = useState(false)

  const media = parseMediaUrl(gift.musicUrl)
  const photos = gift.photos || []

  function set(field, value) {
    onChangeGift({ ...gift, [field]: value })
  }

  async function handlePhotos(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setPhotoError('')

    const remaining = MAX_PHOTOS - photos.length
    if (remaining <= 0) {
      setPhotoError(`Хамгийн ихдээ ${MAX_PHOTOS} зураг оруулна`)
      return
    }
    setUploading(true)
    try {
      const toAdd = files.slice(0, remaining)
      const compressed = await Promise.all(toAdd.map((f) => fileToCompressedDataUrl(f)))
      set('photos', [...photos, ...compressed])
      if (files.length > remaining) {
        setPhotoError(`Зөвхөн ${remaining} зураг нэмэгдлээ (дээд хязгаар ${MAX_PHOTOS})`)
      }
    } catch {
      setPhotoError('Зураг боловсруулахад алдаа гарлаа')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function removePhoto(idx) {
    set('photos', photos.filter((_, i) => i !== idx))
  }


  return (
    <div>
      <div className="mb-6">
        <h2 className="font-playfair italic text-2xl text-ink">Туузаа болон захидал</h2>
        <p className="font-cormorant text-ink/50 mt-0.5">
          Баглаагаа гоёж, хүлээн авагчид зориулсан дижитал бэлэг нэмээрэй
        </p>
      </div>

      <div className="flex flex-col gap-5">

        {/* ── Ribbon ── */}
        <Section icon="🎀" title="Туузны өнгө" hint="Баглааны туузаа сонгоно уу">
          <div className="flex gap-4 flex-wrap">
            {RIBBONS.map((r) => {
              const active = selectedRibbon === r.id
              return (
                <button
                  key={r.id}
                  onClick={() => onChangeRibbon(r.id)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className={`relative w-14 h-14 rounded-full transition-all duration-200 ${
                      active ? 'scale-110 ring-2 ring-offset-2 ring-gold-mid' : 'hover:scale-105'
                    }`}
                    style={{ background: r.color }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 40 40" className="w-8 h-8">
                        <ellipse cx="12" cy="20" rx="10" ry="6" fill={r.accent} opacity="0.8" transform="rotate(-20,12,20)" />
                        <ellipse cx="28" cy="20" rx="10" ry="6" fill={r.accent} opacity="0.8" transform="rotate(20,28,20)" />
                        <circle cx="20" cy="20" r="4" fill={r.accent} />
                      </svg>
                    </div>
                    {active && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-cream"
                        style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }}>
                        ✓
                      </div>
                    )}
                  </div>
                  <span className={`font-cormorant text-xs transition-colors ${active ? 'text-gold-dark font-medium' : 'text-ink/50'}`}>
                    {r.name}
                  </span>
                </button>
              )
            })}
          </div>
        </Section>

        {/* ── Letter ── */}
        <Section icon="💌" title="Мэндчилгээний захидал" hint="Хэнд зориулж байна вэ?">
          <div className="flex flex-col gap-4">
            {/* Recipient name */}
            <div>
              <label className="font-cormorant text-sm text-ink/60 mb-1 block">Хүлээн авагчийн нэр</label>
              <input
                type="text"
                value={gift.recipientName || ''}
                onChange={(e) => set('recipientName', e.target.value)}
                placeholder="Жишээ: Сараа"
                className="w-full rounded-xl border border-gold-light/80 bg-white/60 px-4 py-2.5 font-cormorant text-base text-ink placeholder-ink/30 focus:outline-none focus:border-gold-mid transition-colors"
              />
            </div>

            {/* Letter text */}
            <div>
              <label className="font-cormorant text-sm text-ink/60 mb-1 block">Захидлын текст</label>
              <div className="relative">
                <textarea
                  value={gift.letterText || ''}
                  onChange={(e) => set('letterText', e.target.value)}
                  maxLength={600}
                  rows={5}
                  placeholder={'Зүрх сэтгэлээсээ хэдэн үг бичээрэй...\n\nЭнэ захидал таны бэлгийн хуудсан дээр гоё фонтоор харагдана.'}
                  className="w-full rounded-xl border border-gold-light/80 bg-white/60 px-4 py-3 font-cormorant text-base text-ink placeholder-ink/30 focus:outline-none focus:border-gold-mid resize-none transition-colors"
                />
                <span className="absolute bottom-2.5 right-3 font-cormorant text-xs text-ink/30">
                  {(gift.letterText || '').length}/600
                </span>
              </div>
            </div>

            {/* Font picker */}
            <div>
              <label className="font-cormorant text-sm text-ink/60 mb-2 block">Захидлын фонт</label>
              <div className="grid grid-cols-3 gap-2">
                {LETTER_FONTS.map((f) => {
                  const active = (gift.letterFont || 'elegant') === f.id
                  return (
                    <button
                      key={f.id}
                      onClick={() => set('letterFont', f.id)}
                      className={`rounded-xl border py-3 px-2 flex flex-col items-center gap-1 transition-all ${
                        active
                          ? 'border-gold-mid bg-gold-light/30 shadow-sm'
                          : 'border-gold-light/60 hover:border-gold-mid/50'
                      }`}
                    >
                      <span className="text-2xl text-ink leading-none" style={f.style}>{f.preview}</span>
                      <span className={`font-cormorant text-xs ${active ? 'text-gold-dark font-medium' : 'text-ink/50'}`}>
                        {f.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </Section>

        {/* ── Music ── */}
        <Section icon="🎵" title="Дуу / Spotify" hint="Хуудас нээгдэхэд автоматаар тоглоно">
          <input
            type="url"
            value={gift.musicUrl || ''}
            onChange={(e) => set('musicUrl', e.target.value)}
            placeholder="Spotify эсвэл YouTube линк буулгана уу"
            className="w-full rounded-xl border border-gold-light/80 bg-white/60 px-4 py-2.5 font-cormorant text-base text-ink placeholder-ink/30 focus:outline-none focus:border-gold-mid transition-colors"
          />

          {gift.musicUrl && (
            media ? (
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-cormorant tracking-wide"
                    style={{ background: 'rgba(201,169,97,0.15)', color: '#8A6E2F' }}>
                    {media.provider === 'spotify' ? '♫ Spotify' : '▶ YouTube'} холбогдлоо
                  </span>
                </div>
                <iframe
                  title="media-preview"
                  src={media.embedUrl.replace('autoplay=1', 'autoplay=0')}
                  width="100%"
                  height={Math.min(media.height, 152)}
                  frameBorder="0"
                  allow="encrypted-media"
                  className="rounded-xl"
                />
              </div>
            ) : (
              <p className="font-cormorant text-sm text-red-400/80 mt-2">
                Линк танигдсангүй. Spotify эсвэл YouTube-ийн зөв линк оруулна уу.
              </p>
            )
          )}
        </Section>

        {/* ── Photo album ── */}
        <Section icon="📸" title="Зурган цомог" hint={`Хамгийн ихдээ ${MAX_PHOTOS} зураг — хуудсанд цомог болж харагдана`}>
          <div className="flex flex-wrap gap-3">
            {photos.map((src, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group border border-gold-light/60">
                <img src={src} alt={`Зураг ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removePhoto(i)}
                  className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-cream text-lg"
                  aria-label="Устгах"
                >
                  ✕
                </button>
              </div>
            ))}

            {photos.length < MAX_PHOTOS && (
              <label className={`w-20 h-20 rounded-xl border-2 border-dashed border-gold-mid/40 flex flex-col items-center justify-center cursor-pointer hover:border-gold-mid/70 hover:bg-gold-light/20 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <span className="text-2xl text-gold-mid leading-none">{uploading ? '…' : '+'}</span>
                <span className="font-cormorant text-[10px] text-ink/40 mt-1">
                  {uploading ? 'Ачааллаж...' : 'Зураг нэмэх'}
                </span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
              </label>
            )}
          </div>
          {photoError && <p className="font-cormorant text-sm text-red-400/80 mt-2">{photoError}</p>}
          {photos.length > 0 && (
            <p className="font-cormorant text-xs text-ink/35 mt-2">{photos.length}/{MAX_PHOTOS} зураг</p>
          )}
        </Section>

        {/* ── NFC chip content ── */}
        <Section icon="📲" title="NFC chip-д бичлэг нэм" hint="Утсаа ойртуулахад chip-д шууд харагдах бичлэг">
          <div className="relative">
            <textarea
              value={gift.nfcText || ''}
              onChange={(e) => set('nfcText', e.target.value)}
              maxLength={200}
              rows={3}
              placeholder="Хайртай нэгэндээ мэндчилгээ бич..."
              className="w-full rounded-xl border border-gold-light/80 bg-white/60 px-4 py-2.5 font-cormorant text-base text-ink placeholder-ink/30 focus:outline-none focus:border-gold-mid resize-none transition-colors"
            />
            <span className="absolute bottom-2.5 right-3 font-cormorant text-xs text-ink/30">
              {(gift.nfcText || '').length}/200
            </span>
          </div>
        </Section>
      </div>

      <WizardNav onNext={onNext} onPrev={onPrev} nextDisabled={!selectedRibbon} nextLabel="Хураангуй харах →" />
    </div>
  )
}
