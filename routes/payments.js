const express = require('express')
const router = express.Router()
const Payment = require('../models/Payment')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('tenant', 'name')
      .populate('unit', 'unitNumber')
      .populate('property', 'name')
      .sort({ createdAt: -1 })
    res.json(payments)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/', auth, async (req, res) => {
  try {
    const { tenant, unit, property, amount, month, status, notes } = req.body
    if (!tenant) return res.status(400).json({ message: 'Tenant is required' })
    if (!unit) return res.status(400).json({ message: 'Unit is required' })
    if (!property) return res.status(400).json({ message: 'Property is required' })
    if (!amount) return res.status(400).json({ message: 'Amount is required' })
    if (!month) return res.status(400).json({ message: 'Month is required' })
    const data = { tenant, unit, property, amount: Number(amount), month, status }
    if (notes) data.notes = notes
    if (status === 'paid') data.paidAt = new Date()
    const payment = await Payment.create(data)
    res.status(201).json(payment)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const { tenant, unit, property, amount, month, status, notes } = req.body
    const data = { amount: Number(amount), month, status, notes }
    if (tenant) data.tenant = tenant
    if (unit) data.unit = unit
    if (property) data.property = property
    if (status === 'paid') data.paidAt = new Date()
    const payment = await Payment.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
    res.json(payment)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await Payment.findByIdAndDelete(req.params.id)
    res.json({ message: 'Payment deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
