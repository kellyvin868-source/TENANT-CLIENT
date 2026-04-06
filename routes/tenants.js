const express = require('express')
const router = express.Router()
const Tenant = require('../models/Tenant')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  try {
    const tenants = await Tenant.find()
      .populate('unit', 'unitNumber')
      .populate('property', 'name')
      .sort({ createdAt: -1 })
    res.json(tenants)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, unit, property, leaseStart, leaseEnd, status } = req.body
    if (!name) return res.status(400).json({ message: 'Name is required' })
    if (!email) return res.status(400).json({ message: 'Email is required' })
    if (!phone) return res.status(400).json({ message: 'Phone is required' })
    const data = { name, email, phone, status }
    if (unit) data.unit = unit
    if (property) data.property = property
    if (leaseStart) data.leaseStart = leaseStart
    if (leaseEnd) data.leaseEnd = leaseEnd
    const tenant = await Tenant.create(data)
    res.status(201).json(tenant)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const { name, email, phone, unit, property, leaseStart, leaseEnd, status } = req.body
    const data = { name, email, phone, status }
    if (unit) data.unit = unit
    if (property) data.property = property
    if (leaseStart) data.leaseStart = leaseStart
    if (leaseEnd) data.leaseEnd = leaseEnd
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
    res.json(tenant)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await Tenant.findByIdAndDelete(req.params.id)
    res.json({ message: 'Tenant deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
