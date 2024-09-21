const Product = require('./models/product');
const Store = require('./models/store');
const Review = require('./models/review');
const Seller = require('./models/seller');
const Cart = require('./models/buyer');
const Buyer = require('./models/cart');
const Wishlist = require('./models/wishlist');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ecw-gohanhango');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection: error: '));
db.once('open', () => {
    console.log('Database connected');
});

async function seedDB() {
    await Cart.deleteMany({});
    await Buyer.deleteMany({});
    await Wishlist.deleteMany({});
    await Seller.deleteMany({});
    await Review.deleteMany({});
    await Product.deleteMany({});
    await Store.deleteMany({});
    for (let i = 1; i <= 50; i++) {
        const product = new Product({
            description: `This is product number ${i}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/ddkovkfl2/image/upload/v1726218546/ECW/xyyxts643pukl2vw5b8p.png',
                    filename: 'ECW/xyyxts643pukl2vw5b8p'
                },
                {
                    url: 'https://res.cloudinary.com/ddkovkfl2/image/upload/v1726218553/ECW/hbpjnqckpigque2ujjhd.png',
                    filename: 'ECW/hbpjnqckpigque2ujjhd'
                }
            ]
            ,
            name: `Product Number ${i}`,
            price: `${i}`,
            quantity: `${i}`
        })
        await product.save();
    }

    for (let i = 1; i <= 5; i++) {
        const store = new Store({
            name: `Store Number ${i}`,
            phone: i,
            geometry: {
                type: 'Point',
                coordinates: [-77.03656660379113, 38.90253878012649]
            },
            address: `Street ${i}, Philippines`,
            logo: `https://picsum.photos/400?random=${Math.random()}`,
            banner: `https://picsum.photos/400?random=${Math.random()}`
        })
        await store.save();
    }

    for (let i = 1; i <= 5; i++) {
        const seller = new Seller({ username: `seller${i}`, email: `seller${i}@gmail.com` });
        await Seller.register(seller, `seller${i}`);
    }

    const sellers = await Seller.find({});
    const products = await Product.find({});
    const stores = await Store.find({});

    for (let i = 0; i < 5; i++) {
        stores[i].seller = sellers[i];
        await stores[i].save();
    }

    for (let i = 0; i < 10; i++) {
        products[i].store = stores[0];
        await products[i].save();
    }

    for (let i = 10; i < 20; i++) {
        products[i].store = stores[1];
        await products[i].save();
    }

    for (let i = 20; i < 30; i++) {
        products[i].store = stores[2];
        await products[i].save();
    }

    for (let i = 30; i < 40; i++) {
        products[i].store = stores[3];
        await products[i].save();
    }

    for (let i = 40; i < 50; i++) {
        products[i].store = stores[4];
        await products[i].save();
    }
}

seedDB()
    .then(() => {
        mongoose.disconnect();
    });