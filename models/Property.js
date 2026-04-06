const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  type: { type: String, enum: ['apartment', 'house', 'commercial'], default: 'apartment' },
  totalUnits: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Property', propertySchema)
