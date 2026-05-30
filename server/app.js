import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import orderRoutes from './routes/orders.js'
import giftRoutes from './routes/gift.js'

const app = express()

// ── Middleware ──
app.use(cors())
app.use(express.json({ limit: '15mb' }))

// ── DB холболтыг хүсэлт бүрийн өмнө баталгаажуулна (serverless-д cold start бүрт, cached) ──
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (err) {
    console.error('DB холболтын алдаа:', err.message)
    res.status(503).json({ error: 'Өгөгдлийн сантай холбогдож чадсангүй' })
  }
})

// ── Health check ──
const health = (req, res) =>
  res.json({ ok: true, service: 'Tsetsegly API', time: new Date().toISOString() })
app.get('/', health)
app.get('/api/health', health)

// ── Routes ──
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/gift', giftRoutes)

// ── 404 ──
app.use((req, res) => res.status(404).json({ error: 'Хаяг олдсонгүй' }))

export default app
