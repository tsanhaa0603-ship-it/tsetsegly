const LABELS = ['Цэцэг', 'Боолт', 'Туузаа', 'Захиалга']

export default function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {Array.from({ length: total }, (_, i) => {
        const num = i + 1
        const done = num < current
        const active = num === current

        return (
          <div key={num} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-cormorant font-medium transition-all duration-300 ${
                  done
                    ? 'text-cream'
                    : active
                    ? 'text-ink ring-2 ring-offset-2 ring-gold-mid'
                    : 'text-ink/30 ring-1 ring-ink/20'
                }`}
                style={
                  done
                    ? { background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }
                    : active
                    ? { background: 'linear-gradient(135deg, #F4EBD3, #C9A961)' }
                    : { background: '#FAF7F2' }
                }
              >
                {done ? '✓' : num}
              </div>
              <span
                className={`text-xs font-cormorant tracking-widest uppercase transition-colors duration-300 ${
                  active ? 'text-gold-dark font-medium' : done ? 'text-ink/50' : 'text-ink/30'
                }`}
              >
                {LABELS[i]}
              </span>
            </div>

            {/* Connector line */}
            {num < total && (
              <div className="w-12 md:w-20 h-px mb-5 mx-1">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    background:
                      done
                        ? 'linear-gradient(90deg, #C9A961, #8A6E2F)'
                        : 'rgba(201,169,97,0.25)',
                  }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
