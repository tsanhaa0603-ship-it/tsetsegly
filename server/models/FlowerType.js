import mongoose from 'mongoose'

const ColorSchema = new mongoose.Schema(
  {
    key: String,
    name: String,
    hex: String,
    image: { type: String, default: '' },
    price: { type: Number, default: 0 },
  },
  { _id: false }
)

const FlowerTypeSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    name: String,
    emoji: String,
    hint: String,
    order: { type: Number, default: 0 },
    colors: { type: [ColorSchema], default: [] },
  },
  { timestamps: true }
)

export default mongoose.model('FlowerType', FlowerTypeSchema)
