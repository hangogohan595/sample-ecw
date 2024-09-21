const Store = require('../../models/store');
const Product = require('../../models/product');
const Review = require('../../models/review');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.mainStores = async (req, res) => {
    const stores = await Store.find({ seller: res.locals.currentUser }).populate('seller');
    res.render('seller/stores/main', { stores });
}

module.exports.renderAddStore = (req, res) => {
    res.render('seller/stores/add');
}

module.exports.addStore = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.store.address,
        limit: 1
    }).send()
    const { store } = req.body;
    if ((store.logo && !store.logo.startsWith('https://')) & (store.banner && !store.banner.startsWith('https://'))) {
        store.logo = 'https://' + store.logo;
        store.banner = 'https://' + store.banner;
    }
    const newStore = new Store(store);
    newStore.seller = req.user._id;
    newStore.geometry = geoData.body.features[0].geometry;
    await newStore.save();
    res.redirect('/s/stores');
}

module.exports.showStore = async (req, res) => {
    const { id } = req.params;
    const store = await Store.findById(id).populate('seller');
    const products = await Product.find({ store: id });
    if (!store) {
        throw new AppError('Bad Request', 400);
    }
    res.render('seller/stores/show', { store, products });
}

module.exports.deleteStore = async (req, res) => {
    try {
        const { id } = req.params;
        const currentStore = await Store.findById(id).populate('seller');
        if (currentStore.seller.equals(req.user.id)) {
            await mongoose.transaction(async session => {
                const store = await Store.findByIdAndDelete(id, { session });
                const products = await Product.find({ store: { _id: id } }, { session });
                await Promise.all(products.map(product => Review.deleteMany({ _id: { $in: product.reviews } }, { session })));
                await Product.deleteMany({ store: { _id: id } }, { session });
            });
            req.flash('success', 'Store successfully deleted');
            res.redirect('/s/stores');
        } else {
            req.flash('error', 'Store not found');
            res.redirect('/s/stores');
        }
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error deleting store');
        res.redirect('/s/stores');
    }
}

module.exports.renderEditStore = async (req, res) => {
    const { id } = req.params;
    const store = await Store.findById(id);
    if (!store) {
        throw new AppError('400', 'Store not found');
    } else {
        res.render('seller/stores/edit', { store });
    }
}

module.exports.editStore = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.store.address,
        limit: 1
    }).send()
    const { id } = req.params;
    const store = await Store.findByIdAndUpdate(id, req.body.store);
    if (!store) {
        throw new AppError('400', 'Store not found');
    } else {
        if (store.seller.equals(req.user.id)) {
            store.geometry = geoData.body.features[0].geometry;
            await store.save();
            req.flash('success', 'Store successfully edited');
            res.redirect(`/s/stores/${id}`);
        } else {
            req.flash('error', 'Store not found');
            res.redirect('/s/stores');
        }
    }
}