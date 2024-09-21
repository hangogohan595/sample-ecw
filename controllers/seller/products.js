const Product = require('../../models/product');
const { cloudinary } = require('../../cloudinary');

module.exports.mainProducts = async (req, res) => {
    const { id } = req.params;
    res.redirect(`/s/stores/${id}`);
}

module.exports.renderAddProduct = (req, res) => {
    const { id } = req.params;
    res.render('seller/products/add', { id });
}

module.exports.addProduct = async (req, res) => {
    const { id } = req.params;
    req.body.product.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    const newProduct = new Product(req.body.product);
    newProduct.store = id;
    await newProduct.save();
    req.flash('success', 'Product successfully added');
    res.redirect(`/s/stores/${id}`);
}

module.exports.showProduct = async (req, res, next) => {
    const { id, prod_id } = req.params;
    const product = await Product.findById(prod_id).populate('reviews');
    if (!product) {
        req.flash('error', 'Product not found');
        return res.redirect(`/products`);
    }
    res.render('seller/products/show', { product, id });
}

module.exports.renderEditProduct = async (req, res) => {
    const { id, prod_id } = req.params;
    const product = await Product.findById(prod_id);
    if (!product) {
        req.flash('error', 'Product not found');
        return res.redirect(`/products`);
    }
    res.render('seller/products/edit', { product, id });
}

module.exports.editProduct = async (req, res) => {
    const { id, prod_id } = req.params;
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    const product = await Product.findByIdAndUpdate(prod_id, req.body.product);
    product.images.push(...imgs);
    await product.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await product.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Product successfully updated')
    res.redirect(`/s/stores/${id}/products/${prod_id}`);
}

module.exports.deleteProduct = async (req, res) => {
    const { id, prod_id } = req.params;
    await Product.findByIdAndDelete(prod_id);
    req.flash('deleted', 'Product successfully deleted');
    res.redirect(`/s/stores/${id}`);
}