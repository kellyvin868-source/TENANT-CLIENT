const express = require('express')
const router = express.Router()
const Property = require('../models/Property')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 })
    res.json(properties)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.post('/', auth, async (req, res) => {
  try {
    const { name, address, city, type, totalUnits } = req.body
    if (!name || !address || !city) return res.status(400).json({ message: 'Name, address and city are required' })
    const property = await Property.create({ name, address, city, type, totalUnits: totalUnits || 0 })
    res.status(201).json(property)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.put('/:id', auth, async (req, res) => {
  try {
    const { name, address, city, type, totalUnits } = req.body
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { name, address, city, type, totalUnits },
      { new: true, runValidators: true }
    )
    res.json(property)
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id)
    res.json({ message: 'Property deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
