import { Router } from 'express'
import BouquetShape from '../models/BouquetShape.js'
import { DEFAULT_SHAPES } from '../config/seedShapes.js'
import auth from '../middleware/auth.js'

const router = Router()

async function ensureSeeded() {
  const count = await BouquetShape.estimatedDocumentCount()
  if (count === 0) await BouquetShape.insertMany(DEFAULT_SHAPES)
}

/* GET /api/shapes — public: идэвхтэй хэлбэрүүд */
router.get('/', async (req, res) => {
  try {
    await ensureSeeded()
    const list = await BouquetShape.find({ active: true }).sort({ order: 1, createdAt: 1 })
    res.json(list)
  } catch (e) {
    console.error('GET /shapes:', e.message)
    res.status(500).json({ error: 'Хэлбэр татахад алдаа гарлаа' })
  }
})

/* GET /api/shapes/manage — admin: бүгд */
router.get('/manage', auth, async (req, res) => {
  await ensureSeeded()
  const list = await BouquetShape.find().sort({ order: 1, createdAt: 1 })
  res.json(list)
})

/* POST /api/shapes — admin: шинэ хэлбэр */
router.post('/', auth, async (req, res) => {
  try {
    const b = req.body || {}
    if (!b.id || !b.name) return res.status(400).json({ error: 'id болон нэр шаардлагатай' })
    const exists = await BouquetShape.findOne({ id: b.id })
    if (exists) return res.status(409).json({ error: 'Энэ id аль хэдийн байна' })
    const created = await BouquetShape.create({
      id: b.id,
      design: b.design || 'round',
      name: b.name,
      desc: b.desc || '',
      en: b.en || '',
      active: b.active !== false,
      order: Number(b.order) || 0,
    })
    res.status(201).json(created)
  } catch (e) {
    console.error('POST /shapes:', e.message)
    res.status(500).json({ error: 'Хадгалахад алдаа гарлаа' })
  }
})

/* PATCH /api/shapes/:mongoId — admin */
router.patch('/:mongoId', auth, async (req, res) => {
  try {
    const allow = ['design', 'name', 'desc', 'en', 'active', 'order']
    const update = {}
    for (const k of allow) if (req.body[k] !== undefined) update[k] = req.body[k]
    if (update.order !== undefined) update.order = Number(update.order) || 0
    const s = await BouquetShape.findByIdAndUpdate(req.params.mongoId, update, { new: true })
    if (!s) return res.status(404).json({ error: 'Хэлбэр олдсонгүй' })
    res.json(s)
  } catch {
    res.status(400).json({ error: 'Буруу ID' })
  }
})

/* DELETE /api/shapes/:mongoId — admin */
router.delete('/:mongoId', auth, async (req, res) => {
  try {
    const s = await BouquetShape.findByIdAndDelete(req.params.mongoId)
    if (!s) return res.status(404).json({ error: 'Хэлбэр олдсонгүй' })
    res.json({ ok: true })
  } catch {
    res.status(400).json({ error: 'Буруу ID' })
  }
})

export default router
