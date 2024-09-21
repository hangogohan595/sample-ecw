const express = require('express');
const router = express.Router({ mergeParams: true });
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const multer = require('multer');

const { storage } = require('../../cloudinary');
const upload = multer({ storage });

const { productSchema } = require('../../models/schemas');

const authMiddleware = require('../../utils/sellerAuthMiddleware');
const { setOrigUrl } = require('../../utils/utilMiddlewares');

const products = require('../../controllers/seller/products');

const validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body);
    if (error) {
        const message = error.details.map(error => error.message).join(',');
        throw new AppError(message, 400);
    } else {
        next();
    }
}

router.route('/products')
    .get(authMiddleware, setOrigUrl, catchAsync(products.mainProducts))
    .post(authMiddleware, upload.array('product[image]'), validateProduct, catchAsync(products.addProduct));

router.get('/products/add', setOrigUrl, authMiddleware, products.renderAddProduct);

router.route('/products/:prod_id')
    .get(setOrigUrl, authMiddleware, catchAsync(products.showProduct))
    .put(authMiddleware, upload.array('images'), validateProduct, catchAsync(products.editProduct))
    .delete(authMiddleware, catchAsync(products.deleteProduct));

router.get('/products/:prod_id/edit', setOrigUrl, authMiddleware, catchAsync(products.renderEditProduct));



module.exports = router;