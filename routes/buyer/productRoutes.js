const express = require('express');
const router = express.Router({ mergeParams: true });
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

const { setOrigUrl } = require('../../utils/utilMiddlewares');

const products = require('../../controllers/buyer/products');

router.get('/products', setOrigUrl, catchAsync(products.mainProducts));

router.get('/products/:prod_id', setOrigUrl, catchAsync(products.showProduct));

module.exports = router;