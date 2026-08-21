import mongoose from 'mongoose'

const BouquetShapeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },   // 'round', 'cascade' г.м
    design: { type: String, default: 'round' },           // аль SVG загвар
    name: { type: String, required: true },
    desc: { type: String, default: '' },
    en: { type: String, default: '' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.model('BouquetShape', BouquetShapeSchema)
