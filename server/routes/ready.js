import { Router } from 'express'
import ReadyBouquet from '../models/ReadyBouquet.js'
import { DEFAULT_READY } from '../config/seedReady.js'
import auth from '../middleware/auth.js'

const router = Router()

async function ensureSeeded() {
  const count = await ReadyBouquet.estimatedDocumentCount()
  if (count === 0) await ReadyBouquet.insertMany(DEFAULT_READY)
}

/* GET /api/ready — public: идэвхтэй бэлэн баглаанууд */
router.get('/', async (req, res) => {
  try {
    await ensureSeeded()
    const list = await ReadyBouquet.find({ active: true }).sort({ order: 1, createdAt: 1 })
    res.json(list)
  } catch (e) {
    console.error('GET /ready:', e.message)
    res.status(500).json({ error: 'Бэлэн баглаа татахад алдаа гарлаа' })
  }
})

/* GET /api/ready/manage — admin: бүгд (идэвхгүй ч хамт) */
router.get('/manage', auth, async (req, res) => {
  await ensureSeeded()
  const list = await ReadyBouquet.find().sort({ order: 1, createdAt: 1 })
  res.json(list)
})

/* POST /api/ready — admin: шинэ баглаа */
router.post('/', auth, async (req, res) => {
  try {
    const b = req.body || {}
    if (!b.name) return res.status(400).json({ error: 'Нэр шаардлагатай' })
    const created = await ReadyBouquet.create({
      name: b.name,
      contents: b.contents || '',
      price: Number(b.price) || 0,
      image: b.image || '',
      active: b.active !== false,
      order: Number(b.order) || 0,
      preset: b.preset || {},
    })
    res.status(201).json(created)
  } catch (e) {
    console.error('POST /ready:', e.message)
    res.status(500).json({ error: 'Хадгалахад алдаа гарлаа' })
  }
})

/* PATCH /api/ready/:id — admin: засах / идэвх toggle */
router.patch('/:id', auth, async (req, res) => {
  try {
    const allow = ['name', 'contents', 'price', 'image', 'active', 'order', 'preset']
    const update = {}
    for (const k of allow) if (req.body[k] !== undefined) update[k] = req.body[k]
    const b = await ReadyBouquet.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!b) return res.status(404).json({ error: 'Баглаа олдсонгүй' })
    res.json(b)
  } catch {
    res.status(400).json({ error: 'Буруу ID' })
  }
})

/* DELETE /api/ready/:id — admin */
router.delete('/:id', auth, async (req, res) => {
  try {
    const b = await ReadyBouquet.findByIdAndDelete(req.params.id)
    if (!b) return res.status(404).json({ error: 'Баглаа олдсонгүй' })
    res.json({ ok: true })
  } catch {
    res.status(400).json({ error: 'Буруу ID' })
  }
})

export default router
