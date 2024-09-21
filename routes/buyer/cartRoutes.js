const express = require('express');
const router = express.Router();
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

const { setOrigUrl } = require('../../utils/utilMiddlewares');
const authMiddleware = require('../../utils/buyerAuthMiddleware');

const carts = require('../../controllers/buyer/carts');

router.get('/b/cart', authMiddleware, setOrigUrl, catchAsync(carts.mainCarts));

router.route('/b/cart/:prod_id')
    .post(authMiddleware, catchAsync(carts.addToCart))
    .put(authMiddleware, catchAsync(carts.deleteCart));

module.exports = router;