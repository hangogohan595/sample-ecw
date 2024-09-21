const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const buyerSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    cart: [{
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    }],
    wishlist: [{
        type: Schema.Types.ObjectId,
        ref: 'Wishlist'
    }]
}, {
    timestamps: true
})

buyerSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Buyer', buyerSchema);