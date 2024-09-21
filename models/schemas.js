const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (Joi) => ({
    type: 'string',
    base: Joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML'
    }, rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);
Joi.objectId = require('joi-objectid')(Joi)

module.exports.productSchema = Joi.object({
    product: Joi.object({
        description: Joi.string().required().escapeHTML(),
        name: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        quantity: Joi.number().required().min(1),
        discount: Joi.object({
            percentage: Joi.number(),
            startDate: Joi.date(),
            endDate: Joi.date()
        }),
        store: Joi.objectId()
    }).required(),
    geometry: Joi.object(),
    deleteImages: Joi.array()
})

module.exports.storeSchema = Joi.object({
    store: Joi.object({
        name: Joi.string().required().escapeHTML(),
        phone: Joi.number().required(),
        address: Joi.string().required().escapeHTML(),
        logo: Joi.string().escapeHTML(),
        banner: Joi.string().escapeHTML()
    }).required(),
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required().escapeHTML(),
        rating: Joi.number().min(1).max(5),
        user: Joi.objectId()
    }).required()
})

module.exports.sellerSchema = Joi.object({
    seller: Joi.object({
        email: Joi.string().required().escapeHTML(),
        username: Joi.string().required().escapeHTML(),
        password: Joi.string().required().escapeHTML()
    }).required()
})

module.exports.buyerSchema = Joi.object({
    buyer: Joi.object({
        email: Joi.string().required().escapeHTML(),
        username: Joi.string().required().escapeHTML(),
        password: Joi.string().required().escapeHTML(),
        firstName: Joi.string().required().escapeHTML(),
        lastName: Joi.string().required().escapeHTML(),
        phone: Joi.string().required().escapeHTML(),
        address: Joi.string().required().escapeHTML(),
        cart: Joi.objectId(),
        wishlist: Joi.objectId()
    }).required()
})