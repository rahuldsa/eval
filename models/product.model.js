const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name: String,
    price: Number,
    device: String
})

const productModel = mongoose.model('product', productSchema)

module.exports = { productModel }