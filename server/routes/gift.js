import { Router } from 'express'
import Order from '../models/Order.js'

const router = Router()

/* GET /api/gift/:id — public: NFC хуудасны мэдээлэл (нэвтрэхгүйгээр) */
router.get('/:id', async (req, res) => {
  try {
    const o = await Order.findById(req.params.id)
    if (!o) return res.status(404).json({ error: 'Бэлэг олдсонгүй' })

    // Зөвхөн хүлээн авагчид зориулсан мэдээлэл (утас зэрэг хувийн мэдээлэл нуугдана)
    res.json({
      id: o._id,
      flowers: o.flowers,
      bouquetShape: o.bouquetShape,
      wrapping: o.wrapping,
      ribbon: o.ribbon,
      senderName: o.customerName,
      recipientName: o.recipientName,
      letterText: o.letterText,
      letterFont: o.letterFont,
      music: o.music,
      nfcText: o.nfcText,
      photos: o.photos,
    })
  } catch {
    res.status(400).json({ error: 'Буруу ID' })
  }
})

export default router
