const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
require('dotenv').config()
const { userModel } = require('../models/user.model')
const { authenticate } = require('../middlewares/authenticate.middleware')
const { authorise } = require('../middlewares/authorise.middleware')

const userRouter = express.Router()

userRouter.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body
    try {
        let user = await userModel.findOne({ email: email })
        if (user) {
            res.status(200).send('email id is registered')
        } else {
            bcrypt.hash(password, 5, async (err, hash) => {
                const main = new userModel({
                    name,
                    email,
                    password: hash,
                    role
                })
                await main.save()
                res.status(200).send('user registered successfully')
            })
        }
    } catch (err) {
        console.log(err);
        res.status(401).send('bad request')
    }
})

userRouter.post('/login', async (req, res) => {
    var { email, password } = req.body
    try {
        let user = await userModel.findOne({ email })
        if (user) {
            let hashpassword = user.password
            bcrypt.compare(password, hashpassword, async (err, result) => {
                if (err) {
                    res.status(200).send('wrong credentials')
                } else if (result) {
                    var maintoken = jwt.sign({ userID: user._id, userrole: user.role }, process.env.main_key, { expiresIn: 60 })
                    var reftoken = jwt.sign({ userID: user._id, userrole: user.role }, process.env.ref_key, { expiresIn: 180 })
                    res.status(200).send({ 'message': 'user login successfull', maintoken, reftoken: reftoken })
                } else {
                    res.status(200).send('wrong credentials')
                }
            })
        } else {
            res.status(200).send('email id not found')
        }
    } catch (err) {
        console.log(err);
        res.status(401).send('bad request')
    }
})

userRouter.get('/logout', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    const blacklistdata = JSON.parse(fs.readFileSync('./blacklistdata.json', 'utf-8'))
    blacklistdata.push(token)
    fs.writeFileSync('./blacklistdata.json', JSON.stringify(blacklistdata))
    res.status(200).send('user logged out successfully')
})

userRouter.get('/getnewtoken', (req, res) => {
    const reftoken = req.headers.authorization.split(' ')[1]
    if (!reftoken) {
        res.send('login again')
    }
    jwt.verify(reftoken, process.env.ref_key, (err, decoded) => {
        if (err) {
            console.log(err);
            res.send('please login first')
        } else {
            const maintoken = jwt.sign({ userID: decoded.userID }, process.env.main_key, { expiresIn: 60 })
            res.send({ 'message': 'user login successfull', maintoken })
        }
    })
    res.send('new normal token')
})

userRouter.get('/products', authenticate, async (req, res) => {
    res.status(200).send('products...')
})

userRouter.get('/addproducts', authenticate, authorise(['seller']), async (req, res) => {
  res.status(200).send('add products...')
})

userRouter.get('/deleteproducts', authenticate, authorise(['seller']), async (req, res) => {
    res.status(200).send('delete products...')
})

module.exports = { userRouter }