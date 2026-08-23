import mongoose from 'mongoose'

const FlowerSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    emoji: String,
    color: String,
    hex: String,
    image: String,
    price: Number,
    qty: Number,
  },
  { _id: false }
)

/* Хүргэлтийн мэдээлэл — Tsetsegly салбар дэлгүүргүй тул
   бүх захиалга хүргэлтээр очно. */
const DeliverySchema = new mongoose.Schema(
  {
    zone: { type: String, default: '' },           // дүүргийн id (delivery.js-ийн DELIVERY_ZONES)
    address: { type: String, default: '' },        // хороо, байр, орц, тоот
    note: { type: String, default: '' },           // орцны код, чиглүүлэг
    recipientName: { type: String, default: '' },
    recipientPhone: { type: String, default: '' },
    surprise: { type: Boolean, default: false },   // хүлээн авагчид урьдчилж залгахгүй
    date: { type: String, default: '' },           // YYYY-MM-DD
    slot: { type: String, default: '' },           // цагийн хуваарийн id
  },
  { _id: false }
)

const OrderSchema = new mongoose.Schema(
  {
    // ── Баглааны бүрэлдэхүүн ──
    flowers: { type: [FlowerSchema], default: [] },
    bouquetShape: { type: String, default: '' },
    wrapping: { type: String, default: '' },
    ribbon: { type: String, default: '' },

    // ── NFC / дижитал бэлэг ──
    nfcText: { type: String, default: '' },
    music: { type: String, default: '' },          // Spotify / YouTube линк
    recipientName: { type: String, default: '' },
    letterText: { type: String, default: '' },
    letterFont: { type: String, default: 'elegant' },
    photos: { type: [String], default: [] },        // base64 зургууд

    // ── Хүргэлт ──
    delivery: { type: DeliverySchema, default: () => ({}) },
    deliveryFee: { type: Number, default: 0 },

    // ── Үнэ ба захиалагч ──
    totalPrice: { type: Number, default: 0 },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },

    // ── Захиалгын явц ──
    status: {
      type: String,
      enum: ['new', 'preparing', 'ready', 'delivered'],
      default: 'new',
    },

    // ── QPay төлбөр ──
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
    },
    qpayInvoiceId: { type: String, default: '' },   // QPay-ийн буцаасан invoice_id
    paidAmount: { type: Number, default: 0 },        // бодитоор төлөгдсөн дүн
    paidAt: { type: Date, default: null },           // төлбөр баталгаажсан огноо
  },
  { timestamps: true }
)

export default mongoose.model('Order', OrderSchema)
