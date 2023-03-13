const jwt = require('jsonwebtoken')
const fs = require('fs')
require('dotenv').config()

const authenticate = async (req, res, next) => {
    var token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        res.status(401).send('bad request')
    }
    const blacklistdata = JSON.parse(fs.readFileSync('./blacklistdata.json', 'utf-8'))
    if (blacklistdata.includes(token)) {
        res.status(200).send('login again')
    } else {
        try {
            let decoded = jwt.verify(token, process.env.main_key)
            if (decoded) {
                let userrole = decoded.userrole
                req.body.userrole = userrole
                next()
            } else {
                res.status(200).send('login again')
            }
        } catch (err) {
            res.status(200).send('login again')
        }
    }
}

module.exports = { authenticate }