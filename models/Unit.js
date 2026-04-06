const mongoose = require('mongoose')

const unitSchema = new mongoose.Schema({
  unitNumber: { type: String, required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  floor: { type: Number, default: 1 },
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  rentAmount: { type: Number, required: true },
  status: { type: String, enum: ['vacant', 'occupied', 'maintenance'], default: 'vacant' },
}, { timestamps: true })

module.exports = mongoose.model('Unit', unitSchema)
