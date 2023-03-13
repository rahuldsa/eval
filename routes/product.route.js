const express = require('express')
const { productModel } = require('../models/product.model')

const productRouter = express.Router()

productRouter.post('/addproducts', async (req, res) => {
    const playload = req.body
    try {
        const new_product = new productModel(playload)
        await new_product.save()
        res.send('product added')
    } catch (err) {
        console.log(err);
        res.send({ 'msg': 'something went wrong' })
    }
})

productRouter.delete('/deleteproducts/:id', async (req, res) => {
    const id = req.params.id
    const product = await productModel.findOne({ '_id': id })
    const userID_in_product = product.userID
    const userID_making_req = req.body.userID
    try {
        if (userID_making_req !== userID_in_product) {
            res.send({ 'msg': 'you are not authorised' })
        } else {
            await productModel.findByIdAndDelete({ '_id': id })
            res.send('product deleted')
        }
    } catch (err) {
        console.log(err);
        res.send({ 'msg': 'something went wrong' })
    }
})

module.exports = { productRouter }