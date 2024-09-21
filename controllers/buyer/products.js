const Product = require('../../models/product');

module.exports.mainProducts = async (req, res) => {
    const products = await Product.find({});
    res.render(`buyer/products/main`, { products });
}

module.exports.showProduct = async (req, res, next) => {
    let currentUser = null;
    if (req.user) {
        currentUser = req.user.id;
    }
    const { prod_id } = req.params;
    const product = await Product.findById(prod_id).populate({
        path: 'reviews',
        populate: {
            path: 'user'
        }
    });
    if (!product) {
        req.flash('error', 'Product not found');
        return res.redirect(`/products`);
    }
    console.log(product);
    res.render('buyer/products/show', { product, currentUser });
}