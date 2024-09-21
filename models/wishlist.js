const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'Buyer'
    }
}, {
    timestamps: true
});

module.exports = new mongoose.model('Wishlist', wishlistSchema);