const bycrypt = require('bcryptjs');
const httpError = require('../models/http-error');

async function authenticateUser(user, password, next, errorMessage) {

    let isValidPassword = false;
    try {
        isValidPassword = await bycrypt.compare(password, user.password);
    } catch (err) {
        const error = new httpError(errorMessage, 500);
        return next(error);
    }
    
    return isValidPassword;
}

module.exports = authenticateUser;