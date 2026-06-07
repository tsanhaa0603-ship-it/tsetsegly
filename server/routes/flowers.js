import { Router } from 'express'
import FlowerType from '../models/FlowerType.js'
import { DEFAULT_FLOWERS } from '../config/seedFlowers.js'
import auth from '../middleware/auth.js'

const router = Router()

/* Collection хоосон бол анхдагч өгөгдлийг lazy seed хийнэ */
async function ensureSeeded() {
  const count = await FlowerType.estimatedDocumentCount()
  if (count === 0) {
    await FlowerType.insertMany(DEFAULT_FLOWERS)
  }
}

/* GET /api/flowers — public: цэцгийн каталог */
router.get('/', async (req, res) => {
  try {
    await ensureSeeded()
    const flowers = await FlowerType.find().sort({ order: 1 })
    res.json(flowers)
  } catch (e) {
    console.error('GET /flowers:', e.message)
    res.status(500).json({ error: 'Каталог татахад алдаа гарлаа' })
  }
})

/* PATCH /api/flowers/:key — admin: цэцгийн өнгүүд/мэдээлэл шинэчлэх
   (өнгө нэмэх/хасах/үнэ тохируулах — colors массивыг бүхэлд нь солино) */
router.patch('/:key', auth, async (req, res) => {
  try {
    const { name, emoji, hint, colors } = req.body || {}
    const update = {}
    if (name !== undefined) update.name = name
    if (emoji !== undefined) update.emoji = emoji
    if (hint !== undefined) update.hint = hint
    if (Array.isArray(colors)) {
      update.colors = colors.map((c) => ({
        key: c.key,
        name: c.name,
        hex: c.hex || '#C9A961',
        image: c.image || '',
        price: Number(c.price) || 0,
      }))
    }
    const flower = await FlowerType.findOneAndUpdate(
      { key: req.params.key },
      update,
      { new: true }
    )
    if (!flower) return res.status(404).json({ error: 'Цэцэг олдсонгүй' })
    res.json(flower)
  } catch (e) {
    console.error('PATCH /flowers:', e.message)
    res.status(500).json({ error: 'Шинэчлэхэд алдаа гарлаа' })
  }
})

export default router
