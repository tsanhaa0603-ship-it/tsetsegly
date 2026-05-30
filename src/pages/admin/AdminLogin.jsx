import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin, setToken } from '../../lib/api'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!password.trim()) {
      setError('Нууц үгээ оруулна уу')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { token } = await adminLogin(password)
      setToken(token)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message || 'Нэвтрэхэд алдаа гарлаа')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#1A1A1A' }}>
      {/* Subtle gold glow */}
      <div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C9A961, transparent)' }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-playfair italic text-4xl" style={{
            background: 'linear-gradient(135deg, #F4EBD3, #C9A961, #8A6E2F)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Tsetsegly
          </h1>
          <p className="font-cormorant tracking-[0.4em] text-xs uppercase text-gold-mid/60 mt-2">
            Админ хяналт
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gold-mid/20 p-7"
          style={{ background: 'linear-gradient(160deg, #222, #1A1A1A)' }}
        >
          <label className="font-cormorant text-sm text-cream/60 mb-2 block">Нууц үг</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            placeholder="••••••••"
            autoFocus
            className={`w-full rounded-xl border px-4 py-3 font-cormorant text-base text-cream bg-black/30 placeholder-cream/20 focus:outline-none transition-colors ${
              error ? 'border-red-500/60' : 'border-gold-mid/25 focus:border-gold-mid'
            }`}
          />
          {error && <p className="font-cormorant text-sm text-red-400 mt-2">⚠ {error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`group relative w-full mt-5 py-3 rounded-xl font-cormorant text-base tracking-widest uppercase overflow-hidden ${loading ? 'opacity-60 cursor-wait' : ''}`}
          >
            <span className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #C9A961, #8A6E2F)' }} />
            {!loading && (
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #F4EBD3, #C9A961)' }} />
            )}
            <span className="relative font-medium text-ink">
              {loading ? 'Нэвтэрч байна…' : 'Нэвтрэх'}
            </span>
          </button>
        </form>

        <p className="text-center font-cormorant text-xs text-cream/25 mt-6">
          Зөвхөн админ хандах эрхтэй
        </p>
      </div>
    </div>
  )
}
