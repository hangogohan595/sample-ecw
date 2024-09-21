const express = require('express');
const router = express.Router();
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

const { setOrigUrl } = require('../../utils/utilMiddlewares');

const stores = require('../../controllers/buyer/stores');

router.get('/b/stores', setOrigUrl, catchAsync(stores.mainStores));

router.get('/b/stores/:id', setOrigUrl, catchAsync(stores.showStore))

module.exports = router;