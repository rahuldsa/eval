const authorise = (arrayofRoles) => {
    return (req, res, next) => {
        const userrole = req.body.userrole
        if (arrayofRoles.includes(userrole)) {
            next()
        } else {
            res.status(200).send('you are not authorised')
        }
    }
}

module.exports = { authorise }