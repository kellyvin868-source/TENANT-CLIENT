const express = require('express')
const router = express.Router()
const Unit = require('../models/Unit')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  try {
    const units = await Unit.find().populate('property', 'name').sort({ createdAt: -1 })
    res.json(units)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/', auth, async (req, res) => {
  try {
    const { unitNumber, property, floor, bedrooms, bathrooms, rentAmount, status } = req.body
    if (!unitNumber) return res.status(400).json({ message: 'Unit number is required' })
    if (!property) return res.status(400).json({ message: 'Property is required' })
    if (!rentAmount) return res.status(400).json({ message: 'Rent amount is required' })
    const unit = await Unit.create({ unitNumber, property, floor, bedrooms, bathrooms, rentAmount, status })
    res.status(201).json(unit)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const { unitNumber, property, floor, bedrooms, bathrooms, rentAmount, status } = req.body
    const update = { unitNumber, floor, bedrooms, bathrooms, rentAmount, status }
    if (property) update.property = property
    const unit = await Unit.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
    res.json(unit)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await Unit.findByIdAndDelete(req.params.id)
    res.json({ message: 'Unit deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
