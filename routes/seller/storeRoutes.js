const express = require('express');
const router = express.Router();
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');

const { storeSchema } = require('../../models/schemas');

const { setOrigUrl } = require('../../utils/utilMiddlewares');
const authMiddleware = require('../../utils/sellerAuthMiddleware');

const stores = require('../../controllers/seller/stores');

const validateStore = (req, res, next) => {
    const { error } = storeSchema.validate(req.body);
    if (error) {
        const message = error.details.map(error => error.message).join(',');
        throw new AppError(message, 400);
    } else {
        next();
    }
}

router.route('/s/stores')
    .get(authMiddleware, setOrigUrl, catchAsync(stores.mainStores))
    .post(authMiddleware, validateStore, catchAsync(stores.addStore));

router.get('/s/stores/add', setOrigUrl, authMiddleware, stores.renderAddStore);

router.route('/s/stores/:id')
    .get(setOrigUrl, authMiddleware, catchAsync(stores.showStore))
    .put(authMiddleware, catchAsync(stores.editStore))
    .delete(authMiddleware, catchAsync(stores.deleteStore));

router.get('/s/stores/:id/edit', authMiddleware, catchAsync(stores.renderEditStore));


module.exports = router;