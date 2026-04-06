const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  amount: { type: Number, required: true },
  month: { type: String, required: true }, // e.g. "2024-01"
  status: { type: String, enum: ['paid', 'pending', 'overdue'], default: 'pending' },
  paidAt: { type: Date },
  notes: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Payment', paymentSchema)
