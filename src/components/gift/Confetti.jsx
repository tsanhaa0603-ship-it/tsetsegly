import { useEffect, useRef } from 'react'

const COLORS = ['#F4EBD3', '#C9A961', '#8A6E2F', '#DDACAB', '#F2A8B8', '#FFFFFF']

/* Хөнгөн canvas confetti — хуудас нээгдэхэд 1 удаа буудаг */
export default function Confetti({ duration = 4500 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let W = (canvas.width = window.innerWidth)
    let H = (canvas.height = window.innerHeight)

    const onResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    const count = Math.min(160, Math.floor(W / 8))
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * -H,
      r: 4 + Math.random() * 6,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      vy: 1.5 + Math.random() * 3,
      vx: -1.5 + Math.random() * 3,
      rot: Math.random() * Math.PI * 2,
      vrot: -0.1 + Math.random() * 0.2,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }))

    const start = performance.now()
    let raf

    const draw = (now) => {
      const elapsed = now - start
      ctx.clearRect(0, 0, W, H)

      // сүүлийн 1 секундэд аажим алга болно
      const fade = elapsed > duration - 1000
        ? Math.max(0, (duration - elapsed) / 1000)
        : 1

      particles.forEach((p) => {
        p.y += p.vy
        p.x += p.vx
        p.vy += 0.03 // gravity
        p.rot += p.vrot

        ctx.save()
        ctx.globalAlpha = fade
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        if (p.shape === 'rect') {
          ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.r / 1.6, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()

        // дэлгэцнээс гарсныг буцааж дээрээс оруулна (duration дуустал)
        if (p.y > H + 20 && elapsed < duration - 1200) {
          p.y = -20
          p.x = Math.random() * W
        }
      })

      if (elapsed < duration) {
        raf = requestAnimationFrame(draw)
      } else {
        ctx.clearRect(0, 0, W, H)
      }
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [duration])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
      aria-hidden="true"
    />
  )
}
