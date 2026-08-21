import { Router } from 'express'
import Wrapping from '../models/Wrapping.js'
import { DEFAULT_WRAPPINGS } from '../config/seedWrappings.js'
import auth from '../middleware/auth.js'

const router = Router()

async function ensureSeeded() {
  const count = await Wrapping.estimatedDocumentCount()
  if (count === 0) await Wrapping.insertMany(DEFAULT_WRAPPINGS)
}

/* GET /api/wrappings — public: идэвхтэй боолтууд */
router.get('/', async (req, res) => {
  try {
    await ensureSeeded()
    const list = await Wrapping.find({ active: true }).sort({ order: 1, createdAt: 1 })
    res.json(list)
  } catch (e) {
    console.error('GET /wrappings:', e.message)
    res.status(500).json({ error: 'Боолт татахад алдаа гарлаа' })
  }
})

/* GET /api/wrappings/manage — admin: бүгд (идэвхгүй ч хамт) */
router.get('/manage', auth, async (req, res) => {
  await ensureSeeded()
  const list = await Wrapping.find().sort({ order: 1, createdAt: 1 })
  res.json(list)
})

/* POST /api/wrappings — admin: шинэ боолт */
router.post('/', auth, async (req, res) => {
  try {
    const b = req.body || {}
    if (!b.id || !b.name) return res.status(400).json({ error: 'id болон нэр шаардлагатай' })
    const exists = await Wrapping.findOne({ id: b.id })
    if (exists) return res.status(409).json({ error: 'Энэ id аль хэдийн байна' })
    const created = await Wrapping.create({
      id: b.id,
      name: b.name,
      desc: b.desc || '',
      price: Number(b.price) || 0,
      category: b.category || 'matte',
      image: b.image || '',
      dot: b.dot || '#C9A961',
      svgWrap: b.svgWrap || b.dot || '#EFE5D0',
      active: b.active !== false,
      order: Number(b.order) || 0,
    })
    res.status(201).json(created)
  } catch (e) {
    console.error('POST /wrappings:', e.message)
    res.status(500).json({ error: 'Хадгалахад алдаа гарлаа' })
  }
})

/* PATCH /api/wrappings/:mongoId — admin: засах / идэвх toggle */
router.patch('/:mongoId', auth, async (req, res) => {
  try {
    const allow = ['name', 'desc', 'price', 'category', 'image', 'dot', 'svgWrap', 'active', 'order']
    const update = {}
    for (const k of allow) if (req.body[k] !== undefined) update[k] = req.body[k]
    if (update.price !== undefined) update.price = Number(update.price) || 0
    const w = await Wrapping.findByIdAndUpdate(req.params.mongoId, update, { new: true })
    if (!w) return res.status(404).json({ error: 'Боолт олдсонгүй' })
    res.json(w)
  } catch {
    res.status(400).json({ error: 'Буруу ID' })
  }
})

/* DELETE /api/wrappings/:mongoId — admin */
router.delete('/:mongoId', auth, async (req, res) => {
  try {
    const w = await Wrapping.findByIdAndDelete(req.params.mongoId)
    if (!w) return res.status(404).json({ error: 'Боолт олдсонгүй' })
    res.json({ ok: true })
  } catch {
    res.status(400).json({ error: 'Буруу ID' })
  }
})

export default router
