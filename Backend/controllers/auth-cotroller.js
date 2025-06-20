const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const httpError = require('../models/http-error');
const client = require('../models/db');
const requestValidation = require('../middleware/requestValidation');
const verifyGSTIN = require('../functions/verifyGSTIN');
const validateUser = require('../functions/validateUser');
const authenticateUser = require('../functions/authenticateUser');
const JWT_SECRET = process.env.JWT_SECRET;

const signup = async (req, res, next) => {
    const { name, email, GSTIN, password } = req.body;
    console.log('signup for', email);
    requestValidation(req, next);
    verifyGSTIN(GSTIN, next);
    const errorMessage = 'Could not create user, something went wrong';
    const normalizedEmail = email.toLowerCase().trim();
    const existingUsers = await validateUser(normalizedEmail, next, errorMessage);
    if (existingUsers.length > 0) {
        const error = new httpError('User already exists, please signin', 500);
        return next(error);
    }

    let existingGSTIN;
    try {
        existingGSTIN = await client.query('SELECT * FROM users WHERE gstin = $1', [GSTIN]);
    } catch (err) {
        console.log(err);
        const error = new httpError(errorMessage, 500);
        return next(error);
    }
    if (existingGSTIN.rows.length > 0) {
        const error = new httpError('GSTIN already exists, please signin', 500);
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bycrypt.hash(password, 12);
    } catch (err) {
        console.log(err);
        const error = new httpError(errorMessage, 500);
        return next(error);
    }

    const insert_query  = `INSERT INTO users (name, email, gstin, password) VALUES ($1, $2, $3, $4)`;  
    try {
        await client.query(insert_query, [name, normalizedEmail, GSTIN, hashedPassword]);
    } catch (err) {
        console.log(err);
        const error = new httpError(errorMessage, 500);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign({ email: normalizedEmail, GSTIN: GSTIN }, JWT_SECRET, { expiresIn: '4h' });
    } catch (err) {
        console.log(err);
        const error = new httpError(errorMessage, 500);
        return next(error);
    }
    
    res.status(201).json({ email: normalizedEmail, GSTIN: GSTIN, name: name, token: token });
};

const signin = async (req, res, next) => {
    const { email, password } = req.body;
    console.log('signin for', email);
    requestValidation(req, next);
    const errorMessage = 'Could not login, something went wrong';
    const normalizedEmail = email.toLowerCase().trim();
    let existingUsers;
    try {
        existingUsers = await validateUser(normalizedEmail, next, errorMessage);
    } catch (err) {
        console.log(err);
        const error = new httpError(errorMessage, 500);
        return next(error);
    }
    const user = existingUsers[0];
    if (!user) {
        const error = new httpError('User not found, please register first', 401);
        return next(error);
    }
    const isValidPassword = await authenticateUser(user, password, next, errorMessage);
    if (!isValidPassword) {
        const error = new httpError('Invalid password, please try again', 401);
        return next(error);
    } 
    
    let token;
    try {
        token = jwt.sign({ email: normalizedEmail, GSTIN: user.gstin }, JWT_SECRET, { expiresIn: '4h' });
    } catch (err) {
        console.log(err, 'error in token');
        const error = new httpError(errorMessage, 500);
        return next(error);
    }
    
    res.status(200).json({ email: normalizedEmail, GSTIN: user.gstin, name: user.name, token: token });

}

module.exports = { signup, signin };