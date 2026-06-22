/* ─────────────────────────────────────────────────────────────
   QPay V2 төлбөрийн endpoint-ууд

   POST /api/qpay/invoice        — захиалгад нэхэмжлэх (QR) үүсгэнэ
   POST /api/qpay/callback       — QPay-ийн webhook (төлбөр амжсанд)
   GET  /api/qpay/status/:orderId — frontend polling-д төлбөрийн статус
───────────────────────────────────────────────────────────── */
import { Router } from 'express'
import Order from '../models/Order.js'
import { createInvoice, checkPayment } from '../services/qpay.js'

const router = Router()

/* ─── POST /api/qpay/invoice ───
   Body: { orderId }
   Буцаах: { invoiceId, qrImage, qrText, urls } */
router.post('/invoice', async (req, res) => {
  try {
    const { orderId } = req.body || {}
    if (!orderId) return res.status(400).json({ error: 'orderId шаардлагатай' })

    const order = await Order.findById(orderId)
    if (!order) return res.status(404).json({ error: 'Захиалга олдсонгүй' })

    // Аль хэдийн төлсөн бол дахин нэхэмжлэх үүсгэхгүй
    if (order.paymentStatus === 'paid') {
      return res.json({ alreadyPaid: true })
    }

    const invoice = await createInvoice(order)

    // invoice_id-г захиалгад хадгална (callback болон polling үед хэрэгтэй)
    order.qpayInvoiceId = invoice.invoice_id
    await order.save()

    res.json({
      invoiceId: invoice.invoice_id,
      qrImage: invoice.qr_image,
      qrText: invoice.qr_text,
      urls: invoice.urls,
    })
  } catch (e) {
    console.error('POST /qpay/invoice:', e.message)
    res.status(502).json({ error: 'Төлбөрийн нэхэмжлэх үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.' })
  }
})

/* ─── POST /api/qpay/callback ───
   QPay төлбөр амжсанд энэ URL-ийг дуудна (order_id query-д).
   Callback-д БҮҮ итгэ — QPay-аас дахин шалгаж баталгаажуулна. */
router.post('/callback', async (req, res) => {
  const orderId = req.query.order_id
  try {
    if (!orderId) {
      console.warn('QPay callback: order_id алга')
      return res.status(200).json({})
    }

    const order = await Order.findById(orderId)
    if (!order) {
      console.warn('QPay callback: захиалга олдсонгүй', orderId)
      return res.status(200).json({})
    }

    // Аль хэдийн төлсөн бол дахин боловсруулахгүй (idempotent)
    if (order.paymentStatus === 'paid') {
      return res.status(200).json({})
    }

    if (!order.qpayInvoiceId) {
      console.warn('QPay callback: invoiceId алга', orderId)
      return res.status(200).json({})
    }

    // ЗААВАЛ QPay-аас баталгаажуулна
    const { paid, paidAmount } = await checkPayment(order.qpayInvoiceId)
    if (paid) {
      order.paymentStatus = 'paid'
      order.paidAmount = paidAmount
      order.paidAt = new Date()
      await order.save()
      console.log('✅ Төлбөр баталгаажлаа:', orderId, paidAmount, '₮')
    } else {
      console.warn('QPay callback ирсэн ч төлбөр баталгаажаагүй:', orderId)
    }

    // QPay-д үргэлж 200 буцаана
    res.status(200).json({})
  } catch (e) {
    console.error('POST /qpay/callback:', e.message)
    // QPay дахин оролдохгүйн тулд 200 буцаана (бид polling-оор бас шалгана)
    res.status(200).json({})
  }
})

/* ─── GET /api/qpay/status/:orderId ───
   Frontend 3 секунд тутамд дуудаж төлбөрийн статус шалгана.
   Callback ирээгүй байж болзошгүй тул энд бас QPay-аас идэвхтэй шалгана. */
router.get('/status/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).select(
      'paymentStatus paidAmount paidAt qpayInvoiceId totalPrice status'
    )
    if (!order) return res.status(404).json({ error: 'Захиалга олдсонгүй' })

    // Хараахан төлөгдөөгүй бол QPay-аас идэвхтэй шалгаж баталгаажуулна
    if (order.paymentStatus !== 'paid' && order.qpayInvoiceId) {
      try {
        const { paid, paidAmount } = await checkPayment(order.qpayInvoiceId)
        if (paid) {
          order.paymentStatus = 'paid'
          order.paidAmount = paidAmount
          order.paidAt = new Date()
          await order.save()
          console.log('✅ Төлбөр polling-оор баталгаажлаа:', order._id)
        }
      } catch (e) {
        // Шалгалт амжилтгүй бол өмнөх статусаа л буцаана
        console.warn('status polling check алдаа:', e.message)
      }
    }

    res.json({
      orderId: order._id,
      paymentStatus: order.paymentStatus,
      paidAmount: order.paidAmount,
      paidAt: order.paidAt,
      status: order.status,
    })
  } catch (e) {
    console.error('GET /qpay/status:', e.message)
    res.status(400).json({ error: 'Буруу ID' })
  }
})

export default router
