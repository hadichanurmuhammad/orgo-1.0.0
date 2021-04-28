const { checkJWTToken } = require('../modules/jwt')


module.exports = async function (request, response, next) {
    let token = request.cookies?.token
    token = checkJWTToken(token)
    if(token) {
        request.user = token
    }
    next()
}