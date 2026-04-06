const mongoose = require('mongoose')

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit' },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  leaseStart: { type: Date },
  leaseEnd: { type: Date },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true })

module.exports = mongoose.model('Tenant', tenantSchema)
