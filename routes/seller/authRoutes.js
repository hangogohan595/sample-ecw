const express = require('express');
const router = express.Router();
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const passport = require('passport');

const { sellerSchema } = require('../../models/schemas');

const authMiddleware = require('../../utils/sellerAuthMiddleware');
const { storeReturnTo } = require('../../utils/utilMiddlewares');

const auths = require('../../controllers/seller/auths');

const validateSeller = (req, res, next) => {
    const { error } = sellerSchema.validate(req.body);
    if (error) {
        const message = error.details.map(error => error.message).join(',');
        throw new AppError(message, 400);
    } else {
        next();
    }
}

router.route('/s/signup')
    .get(authMiddleware, auths.renderSignup)
    .post(authMiddleware, validateSeller, catchAsync(auths.submitSignup));

router.route('/s/login')
    .get(authMiddleware, auths.renderLogin)
    .post(authMiddleware, storeReturnTo, passport.authenticate('seller', { failureFlash: true, failureRedirect: '/s/login' }), auths.submitLogin);

router.get('/s/logout', authMiddleware, auths.submitLogout)

module.exports = router;

