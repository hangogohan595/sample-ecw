const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } }

const storeSchema = new Schema({
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller'
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    logo: {
        type: String,
    },
    banner: {
        type: String,
    }
}, {
    timestamps: true
}, opts);

storeSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href="/b/stores/${this._id}">${this.name}</a><b><p>${this.address}</p>`
})

module.exports = mongoose.model('Store', storeSchema);