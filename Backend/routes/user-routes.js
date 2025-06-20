const express = require('express');
const validator = require('express-validator');
const router = express.Router();
const userController = require('../controllers/user-controller');
const authCheck = require('../middleware/auth-check');

const gstinValidator = validator.check('GSTIN').trim().isLength({ min: 15, max: 15 }).withMessage('Invalid GSTIN');
const passwordValidator = [
    validator.check('oldPassword').trim().isLength({ min: 6 }).withMessage('Invalid password'),
    validator.check('newPassword').trim().isLength({ min: 6 }).withMessage('Invalid password'),
    validator.check('confirmPassword').custom((value, { req }) => value === req.body.newPassword).withMessage('password does not match'),
]; 

const deleteUserValidator = validator.check('password').trim().isLength({ min: 6 }).withMessage('Invalid password');

router.post('/gstin', gstinValidator, userController.gstin);
router.use(authCheck); //verify jwt token
router.get('/customs', userController.customs);
router.patch('/change-password', passwordValidator, userController.chnagePassword);
router.post('/delete-account', deleteUserValidator, userController.deleteUser);

module.exports = router;