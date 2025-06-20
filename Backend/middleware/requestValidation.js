const { validationResult } = require('express-validator');
const httpError = require('../models/http-error');

function requestValidation(req, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorText = errors.errors
            .map((err) => `${err.path}: ${err.msg}`)
            .join(', ');
        console.log(errorText);
        const error = new httpError(errorText, 500);
        return next(error);
    }
}

module.exports = requestValidation;