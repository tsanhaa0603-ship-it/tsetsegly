export default function WizardNav({ onNext, onPrev, nextDisabled, nextLabel = 'Үргэлжлүүлэх →' }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8">
      {onPrev ? (
        <button
          onClick={onPrev}
          className="font-cormorant text-sm tracking-widest uppercase text-ink/40 hover:text-ink/70 transition-colors"
        >
          ← Буцах
        </button>
      ) : (
        <span />
      )}

      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={`group relative px-10 py-3 font-cormorant text-sm tracking-widest uppercase overflow-hidden w-full sm:w-auto transition-opacity duration-200 ${
          nextDisabled ? 'opacity-40 cursor-not-allowed' : ''
        }`}
      >
        {!nextDisabled && (
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(135deg, #8A6E2F, #C9A961, #F4EBD3)' }}
          />
        )}
        <span
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #F4EBD3, #C9A961, #8A6E2F)' }}
        />
        <span className="relative text-ink font-medium">{nextLabel}</span>
      </button>
    </div>
  )
}
