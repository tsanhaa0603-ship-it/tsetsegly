import { useState } from 'react'

export default function PhotoCarousel({ photos }) {
  const [idx, setIdx] = useState(0)
  if (!photos || photos.length === 0) return null

  const go = (d) => setIdx((i) => (i + d + photos.length) % photos.length)

  return (
    <div className="w-full">
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/5] bg-ink/5">
        {photos.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Дурсамж ${i + 1}`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: i === idx ? 1 : 0 }}
          />
        ))}

        {/* Soft gold frame */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(201,169,97,0.4)' }} />

        {photos.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream/80 backdrop-blur-sm flex items-center justify-center text-ink/70 hover:bg-cream transition-colors shadow-md"
              aria-label="Өмнөх"
            >
              ‹
            </button>
            <button
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-cream/80 backdrop-blur-sm flex items-center justify-center text-ink/70 hover:bg-cream transition-colors shadow-md"
              aria-label="Дараах"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {photos.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === idx ? 22 : 7,
                height: 7,
                background: i === idx
                  ? 'linear-gradient(90deg, #C9A961, #8A6E2F)'
                  : 'rgba(201,169,97,0.35)',
              }}
              aria-label={`Зураг ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
