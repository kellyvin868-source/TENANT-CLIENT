const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()


const app = express()

const corsOptions = { origin: true, methods: ['GET','POST','PUT','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'], credentials: true }
app.use(cors(corsOptions))
app.use(express.json())




// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/properties', require('./routes/properties'))
app.use('/api/units', require('./routes/units'))
app.use('/api/tenants', require('./routes/tenants'))
app.use('/api/payments', require('./routes/payments'))
app.use('/api/dashboard', require('./routes/dashboard'))

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(() => {
    console.log('MongoDB connected')
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))
  })
  .catch(err => console.error('DB connection error:', err))
