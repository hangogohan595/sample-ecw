const express = require('express');
const router = express.Router();
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const passport = require('passport');

const Buyer = require('../../models/buyer');
const { buyerSchema } = require('../../models/schemas');

const authMiddleware = require('../../utils/buyerAuthMiddleware');
const { storeReturnTo } = require('../../utils/utilMiddlewares');

const auths = require('../../controllers/buyer/auths');

const validateBuyer = (req, res, next) => {
    const { error } = buyerSchema.validate(req.body);
    if (error) {
        const message = error.details.map(error => error.message).join(',');
        throw new AppError(message, 400);
    } else {
        next();
    }
}

router.route('/b/signup')
    .get(authMiddleware, auths.renderSignup)
    .post(authMiddleware, validateBuyer, catchAsync(auths.submitSignup));

router.route('/b/login')
    .get(authMiddleware, auths.renderLogin)
    .post(authMiddleware, storeReturnTo, passport.authenticate('buyer', { failureFlash: true, failureRedirect: '/b/login' }), auths.submitLogin);

router.get('/b/logout', authMiddleware, auths.submitLogout);

module.exports = router;

