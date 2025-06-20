const httpError = require('../models/http-error');
const client = require('../models/db');

async function validateUser(email, next, errorMessage) {
    let existingUsers;
    try {
        const queryResult = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        existingUsers = queryResult.rows;
    } catch (err) {
        console.log(err);
        const error = new httpError(errorMessage, 500);
        return next(error);
    }

    return existingUsers;
}

module.exports = validateUser;