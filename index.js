const express = require('express')
require('dotenv').config()
const { connection } = require('./configs/db')
const { userRouter } = require('./routes/user.route')
const { productRouter } = require('./routes/product.route')

const app = express()
app.use(express.json())

app.use('/users', userRouter)
// app.use('/create', productRouter)
// app.use('/products', userRouter)

app.get('/', (req, res) => {
    res.send('home page')
})

app.listen(4500, async () => {
    try {
        await connection
        console.log('successfully connected to db');
    } catch (err) {
        console.log('error connecting to db');
        console.log(err);
    }
    console.log('runs at port 4500');
})