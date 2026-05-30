import { Router } from 'express'
import Order from '../models/Order.js'
import auth from '../middleware/auth.js'

const router = Router()
const STATUS_FLOW = ['new', 'preparing', 'ready', 'delivered']

/* POST /api/orders — public: frontend захиалга үүсгэнэ */
router.post('/', async (req, res) => {
  try {
    const b = req.body || {}
    if (!b.customerName || !b.customerPhone) {
      return res.status(400).json({ error: 'Нэр болон утасны дугаар шаардлагатай' })
    }
    const order = await Order.create({
      flowers: Array.isArray(b.flowers) ? b.flowers : [],
      bouquetShape: b.bouquetShape || '',
      wrapping: b.wrapping || '',
      ribbon: b.ribbon || '',
      nfcText: b.nfcText || '',
      music: b.music || '',
      recipientName: b.recipientName || '',
      letterText: b.letterText || '',
      letterFont: b.letterFont || 'elegant',
      photos: Array.isArray(b.photos) ? b.photos : [],
      totalPrice: Number(b.totalPrice) || 0,
      customerName: b.customerName,
      customerPhone: b.customerPhone,
      status: 'new',
    })
    res.status(201).json({ id: order._id, status: order.status, createdAt: order.createdAt })
  } catch (e) {
    console.error('POST /orders:', e.message)
    res.status(500).json({ error: 'Захиалга хадгалахад алдаа гарлаа' })
  }
})

/* GET /api/orders — admin: бүх захиалга (зурггүйгээр, хөнгөн) */
router.get('/', auth, async (req, res) => {
  const { status } = req.query
  const filter = status ? { status } : {}
  const orders = await Order.find(filter).select('-photos').sort({ createdAt: -1 })
  res.json(orders)
})

/* GET /api/orders/:id — admin: нэг захиалгын бүрэн мэдээлэл */
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ error: 'Захиалга олдсонгүй' })
    res.json(order)
  } catch {
    res.status(400).json({ error: 'Буруу ID' })
  }
})

/* PATCH /api/orders/:id/status — admin: статус өөрчлөх */
router.patch('/:id/status', auth, async (req, res) => {
  const { status } = req.body || {}
  if (!STATUS_FLOW.includes(status)) {
    return res.status(400).json({ error: `Статус нь ${STATUS_FLOW.join(', ')}-ийн нэг байх ёстой` })
  }
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-photos')
    if (!order) return res.status(404).json({ error: 'Захиалга олдсонгүй' })
    res.json(order)
  } catch {
    res.status(400).json({ error: 'Буруу ID' })
  }
})

export default router
