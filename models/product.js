const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const imageSchema = new Schema({
    url: String,
    filename: String
});
imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_150');
})

const productSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    discount: {
        percentage: Number,
        startDate: Date,
        endDate: Date
    },
    images: [imageSchema],
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: 'Store'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    deleteImages: [{
        filename: String
    }]
}, {
    timestamps: true
});

productSchema.post('findOneAndDelete', async function (deletedProduct) {
    if (deletedProduct) {
        await Review.deleteMany({ _id: { $in: deletedProduct.reviews } });
    }
})

module.exports = mongoose.model('Product', productSchema);