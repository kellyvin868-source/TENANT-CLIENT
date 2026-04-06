const express = require('express')
const router = express.Router()
const Property = require('../models/Property')
const Unit = require('../models/Unit')
const Tenant = require('../models/Tenant')
const Payment = require('../models/Payment')
const auth = require('../middleware/auth')

router.get('/', auth, async (req, res) => {
  try {
    const [totalProperties, totalUnits, totalTenants, payments] = await Promise.all([
      Property.countDocuments(),
      Unit.countDocuments(),
      Tenant.countDocuments({ status: 'active' }),
      Payment.find(),
    ])

    const vacantUnits = await Unit.countDocuments({ status: 'vacant' })
    const occupiedUnits = await Unit.countDocuments({ status: 'occupied' })

    const totalRevenue = payments
      .filter(p => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0)

    const pendingPayments = payments.filter(p => p.status === 'pending').length
    const overduePayments = payments.filter(p => p.status === 'overdue').length

    // Last 6 months revenue
    const now = new Date()
    const monthlyRevenue = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const total = payments
        .filter(p => p.status === 'paid' && p.month === key)
        .reduce((sum, p) => sum + p.amount, 0)
      monthlyRevenue.push({ month: key, total })
    }

    res.json({
      totalProperties,
      totalUnits,
      vacantUnits,
      occupiedUnits,
      totalTenants,
      totalRevenue,
      pendingPayments,
      overduePayments,
      monthlyRevenue,
    })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router
