const Review = require('../../models/review');
const Product = require('../../models/product');

module.exports.mainReviews = async (req, res) => {
    const { id } = req.params;
    res.redirect(`/b/products/${id}`);
}

module.exports.submitReview = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    const review = new Review(req.body.review);
    product.reviews.push(review);
    review.user = req.user.id;
    await review.save();
    await product.save();
    req.flash('success', 'Review submitted');
    res.redirect(`/b/products/${id}`,)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (review.user.toString() === req.user.id) {
        await Product.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash('deleted', 'Review deleted');
        res.redirect(`/b/products/${id}`);
    } else {
        req.flash('error', 'Cannot delete review');
        res.redirect(`/b/products/${id}`);
    }
}