const Store = require('../../models/store');
const Product = require('../../models/product');

module.exports.mainStores = async (req, res) => {
    const stores = await Store.find({}).populate('seller');
    console.log("App 2");
    res.render('buyer/stores/main', { stores });
}

module.exports.showStore = async (req, res) => {
    const { id } = req.params;
    const store = await Store.findById(id).populate('seller');
    const products = await Product.find({ store: id });
    if (!store) {
        throw new AppError('Bad Request', 400);
    }
    res.render('buyer/stores/show', { store, products });
}