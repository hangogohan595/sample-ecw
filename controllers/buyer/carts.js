const Buyer = require('../../models/buyer');
const Cart = require('../../models/cart');
const Wishlist = require('../../models/wishlist');

module.exports.mainCarts = async (req, res) => {
    const cart = await Cart.find({ buyer: req.user.id }).populate('product');
    res.render(`buyer/cart/main`, { cart });
}

module.exports.addToCart = async (req, res) => {
    const { prod_id } = req.params;
    const { type } = req.query;
    const buyer = await Buyer.findById(req.user.id);
    if (type === 'cart') {
        const cart = await Cart.findOne({ product: prod_id, buyer: buyer._id });
        if (cart) {
            cart.quantity++;
            await cart.save();
            req.flash('success', 'Product added to cart');
        } else {
            const cart = new Cart({ product: prod_id, quantity: 1, buyer: req.user.id });
            await cart.save();
            buyer.cart.push(cart._id);
            await buyer.save();
            req.flash('success', 'Product added to cart');
        }
    } else {
        const wishlist = await Wishlist.findOne({ product: prod_id, buyer: buyer._id });
        if (wishlist) {
            req.flash('error', 'Already in wishlist');
        } else {
            const wishlist = new Wishlist({ product: prod_id, buyer: req.user.id });
            await wishlist.save();
            buyer.wishlist.push(wishlist._id);
            await buyer.save();
            req.flash('success', 'Product added to wishlist');
        }
    }
    res.redirect(`/b/products`);
}

module.exports.deleteCart = async (req, res) => {
    const { prod_id } = req.params;
    const buyer = await Buyer.findById(req.user.id);
    await Cart.deleteOne({ product: prod_id, buyer: req.user.id })
    buyer.cart.splice(buyer.cart.findIndex((product) => product._id.toString() === prod_id));
    await buyer.save();
    req.flash('delete', 'Product removed from cart');
    res.redirect(`/b/cart`);
}