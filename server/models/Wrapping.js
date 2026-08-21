import mongoose from 'mongoose'

const WrappingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },  // 'cream', 'pink' г.м
    name: { type: String, required: true },
    desc: { type: String, default: '' },
    price: { type: Number, default: 0 },
    category: { type: String, default: 'matte' },
    image: { type: String, default: '' },
    dot: { type: String, default: '#C9A961' },     // зураг байхгүй үеийн өнгө
    svgWrap: { type: String, default: '#EFE5D0' }, // баглааны SVG-д харагдах өнгө
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('Wrapping', WrappingSchema)
