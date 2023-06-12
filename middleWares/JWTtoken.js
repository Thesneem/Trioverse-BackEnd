
const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET;
const maxAge = 3 * 24 * 60 * 60
function createToken(id, email, type) {
    return jwt.sign({ id, email, type }, jwtSecret, {
        expiresIn: maxAge
    })
}

module.exports = { createToken }