require('dotenv').config();

const express = require('express')
const cors = require('cors');
const authRoutes = require('./routes/auth')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const cartRoutes = require('./routes/cart')
const orderRoutes = require('./routes/order')
const paymentRoutes = require('./routes/payment')
const addressRoutes = require('./routes/address')
const authenticate = require('./middlewares/authMiddleware')
const path = require('path');


const app = express()
app.use(cors());
app.use(express.json())


app.use('/api/assets', express.static(path.join(__dirname, 'assets')));

app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)
app.use('/api/cart',authenticate,cartRoutes)
app.use('/api/order',authenticate, orderRoutes)
app.use('/api/pay', authenticate,paymentRoutes)
app.use('/api/address',authenticate, addressRoutes)
/*
app.listen(8080, () => {
    console.log('Server is running')
})
    */

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Internal server error.' })
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});