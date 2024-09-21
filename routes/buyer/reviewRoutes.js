const express = require('express');
const router = express.Router();
const AppError = require('../../utils/AppError');
const catchAsync = require('../../utils/catchAsync');
const flash = require('connect-flash');

const { reviewSchema } = require('../../models/schemas');

const authMiddleware = require('../../utils/buyerAuthMiddleware');

const reviews = require('../../controllers/buyer/reviews');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(error => error.message).join(',');
        throw new AppError(message, 400);
    } else {
        next();
    }
}

router.route('/b/products/:id/reviews')
    .get(catchAsync(reviews.mainReviews))
    .post(authMiddleware, validateReview, catchAsync(reviews.submitReview));

router.delete('/b/products/:id/reviews/:reviewId', authMiddleware, catchAsync(reviews.deleteReview));

module.exports = router;