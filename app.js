const express = require('express')
const authRoutes = require('./routes/auth')
const categoryRoutes = require('./routes/category')
const productRoutes = require('./routes/product')
const path = require('path');

const app = express()

app.use(express.json())


app.use('/api/assets', express.static(path.join(__dirname, 'assets')));

app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)

app.listen(8080, () => {
    console.log('Server is running')
})