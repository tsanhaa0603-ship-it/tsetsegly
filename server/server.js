import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import orderRoutes from './routes/orders.js'
import giftRoutes from './routes/gift.js'

const app = express()

// ── Middleware ──
app.use(cors())                          // React frontend-тэй холбогдоно
app.use(express.json({ limit: '15mb' })) // base64 зургуудыг багтаах

// ── Health check ──
app.get('/', (req, res) => {
  res.json({ ok: true, service: 'Tsetsegly API', time: new Date().toISOString() })
})

// ── Routes ──
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/gift', giftRoutes)

// ── 404 ──
app.use((req, res) => res.status(404).json({ error: 'Хаяг олдсонгүй' }))

// ── Start ──
const PORT = process.env.PORT || 5000
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🌸 Tsetsegly API ${PORT} порт дээр ажиллаж байна`))
  })
  .catch((err) => {
    console.error('❌ Сервер эхлүүлэхэд алдаа гарлаа:', err.message)
    process.exit(1)
  })
