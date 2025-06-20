const express = require('express');
const validator = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth-cotroller');

const signupValidator = [
    validator.check('GSTIN').trim().isLength({ min: 15, max: 15 }).withMessage('Invalid GSTIN'),
    validator.check('email').normalizeEmail().isEmail().withMessage('Invalid Email'),
    validator.check('password').trim().isLength({ min: 6 }).withMessage('password need at least 6 charactrs'),
    validator.check('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('password does not match')
];
const signinValidator = [
    validator.check('email').normalizeEmail().isEmail().withMessage('Invalid Email'),
    validator.check('password').trim().isLength({ min: 6 }).withMessage('Invalid password')
];

router.post('/signup', signupValidator, authController.signup);
router.post('/signin', signinValidator, authController.signin);

module.exports = router;