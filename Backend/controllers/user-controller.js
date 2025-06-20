const bycrypt = require('bcryptjs');
const httpError = require('../models/http-error');
const client = require('../models/db');
const verifyGSTIN = require('../functions/verifyGSTIN');
const requestValidation = require('../middleware/requestValidation');
const validateUser = require('../functions/validateUser');
const authenticateUser = require('../functions/authenticateUser');

const gstin = async (req, res, next) => {
    const GSTIN = req.body.GSTIN;
    console.log('fetching trade name for GSTIN:', GSTIN);
    requestValidation(req, next);
    const tradeName = await verifyGSTIN(GSTIN, next);
    if (!tradeName) {
        return next(new httpError('Invalid GSTIN, please try again', 401));
    }
    res.status(200).json({ tradeName });
};

const customs = async (req, res, next) => {
    const email = req.userData.email;
    console.log('fetching customs table for', email);
    if (!email) {
        return next(new httpError('Authentication failed, please login again.', 401));
    }
    let customsTable;
    try {
        const queryResult = await client.query('SELECT * FROM customs_declarations');
        customsTable = queryResult.rows;
    } catch (err) {
        console.log(err);
        const error = new httpError('Could not login, something went wrong', 500);
        return next(error);
    }

    res.status(200).json({ customsTable });
};

const chnagePassword = async (req, res, next) => {
    const email = req.userData.email;
    const { oldPassword, newPassword } = req.body;
    console.log('chenging password for', email);
    requestValidation(req, next);
    if (!email) {
        return next(new httpError('Authentication failed, please login again.', 401));
    }
    const errorMessage = 'Could not update password, something went wrong';
    const existingUsers = await validateUser(email, next, errorMessage);
    const user = existingUsers[0];

    if (!user) {
        return next(new httpError('User not found, please register first', 401));
    }

    const isValidPassword = await authenticateUser(user, oldPassword, next, errorMessage);
    if (!isValidPassword) {
        return next(new httpError('Invalid password, please try again', 401));
    }

    if (oldPassword === newPassword) {
        return next(new httpError('New password cannot be same as old password', 401));
    }

    try {
        const hashedPassword = await bycrypt.hash(newPassword, 12);
        await client.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
    } catch (err) {
        console.log(err);
        const error = new httpError(errorMessage, 500);
        return next(error);
    }

    res.status(200).json({ message: 'Password updated successfully' });
};

const deleteUser = async (req, res, next) => {
    const email = req.userData.email;
    const password = req.body.password;
    requestValidation(req, next);
    console.log('deleting user for', email);
    if (!email) {
        return next(new httpError('Authentication failed, please login again.', 401));
    }
    const errorMessage = 'Could not delete user, something went wrong';
    const existingUsers = await validateUser(email, next, errorMessage);
    const user = existingUsers[0];
    if (!user) {
        return next(new httpError('User not found, please register first', 401));
    }

    const isValidPassword = await authenticateUser(user, password, next, errorMessage);
    if (!isValidPassword) {
        return next(new httpError('Invalid password, please try again', 401));
    }

    try {
        await client.query('DELETE FROM users WHERE email = $1', [email]);
    } catch (err) {
        console.log(err);
        const error = new httpError(errorMessage, 500);
        return next(error);
    }
    res.status(200).json({ message: 'User deleted successfully' });
};

module.exports = { gstin, customs, chnagePassword, deleteUser };