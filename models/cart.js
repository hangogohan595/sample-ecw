const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        default: 0
    },
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'Buyer'
    }
}, {
    timestamps: true
});

module.exports = new mongoose.model('Cart', cartSchema);