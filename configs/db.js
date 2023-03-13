const mongoose = require('mongoose')
require('dotenv').config()

const connection = mongoose.connect('mongodb+srv://rahul:rahul@cluster0.5gm3a3y.mongodb.net/eval?retryWrites=true&w=majority')

module.exports = { connection }