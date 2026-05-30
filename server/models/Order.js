import mongoose from 'mongoose'

const FlowerSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    emoji: String,
    price: Number,
    qty: Number,
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
  },
  { timestamps: true }
)

export default mongoose.model('Order', OrderSchema)
