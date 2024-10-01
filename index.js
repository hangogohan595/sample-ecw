if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Seller = require('./models/seller.js');
const Buyer = require('./models/buyer.js');
const methodOverride = require('method-override');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

// Routes
const sellerStoreRoutes = require('./routes/seller/storeRoutes');
const sellerProductRoutes = require('./routes/seller/productRoutes');
const sellerRoutes = require('./routes/seller/authRoutes');

const buyerStoreRoutes = require('./routes/buyer/storeRoutes');
const buyerProductRoutes = require('./routes/buyer/productRoutes');
const buyerRoutes = require('./routes/buyer/authRoutes');

const cartRoutes = require('./routes/buyer/cartRoutes');
const reviewRoutes = require('./routes/buyer/reviewRoutes');

const dbUrl = process.env.DB_URL;
// const dbUrl = 'mongodb://localhost:27017/ecw-gohanhango';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection: error: '));
db.once('open', () => {
    console.log('Database connected');
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'templates'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'notasecret'
    }
});

store.on('error', function (e) {
    console.log('Session store error', e)
});

const sessionOptions = {
    store,
    name: 'random',
    secret: 'notasecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionOptions));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/"
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/ddkovkfl2/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "https://picsum.photos",
                "https://fastly.picsum.photos"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use('seller', new passportLocal(Seller.authenticate()));
passport.use('buyer', new passportLocal(Buyer.authenticate()));
passport.serializeUser((user, done) => {
    if (user instanceof Seller) {
        Seller.serializeUser()(user, done);
    } else if (user instanceof Buyer) {
        Buyer.serializeUser()(user, done);
    } else {
        done(null, false);
    }
});

passport.deserializeUser((id, done) => {
    Seller.deserializeUser()(id, (err, seller) => {
        if (seller) {
            done(err, seller);
        } else {
            Buyer.deserializeUser()(id, (err, buyer) => {
                done(err, buyer);
            });
        }
    });
});

app.use((req, res, next) => {
    if (req.originalUrl.includes('/b')) {
        req.session.userType = 'buyer';
    } else if (req.originalUrl.includes('/s')) {
        req.session.userType = 'seller';
    }
    res.locals.userType = req.session.userType;
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.deleted = req.flash('deleted');
    res.locals.error = req.flash('error');
    next();
})

app.use('/s/stores/:id', sellerProductRoutes);
app.use('/', sellerStoreRoutes);
app.use('/', sellerRoutes);

app.use('/b', buyerProductRoutes);
app.use('/', buyerStoreRoutes);
app.use('/', buyerRoutes);

app.use('/', cartRoutes);
app.use('/', reviewRoutes);

app.get('/', (req, res) => {
    res.redirect('/b');
})

app.get('/b', (req, res) => {
    res.render('home');
})

app.get('/b/buy', (req, res) => {
    if (req.user) {
        req.logout((err) => {
            if (err) {
                throw new AppError('Error logging out', 400);
            }
            res.redirect('/b');
        })
    } else {
        res.redirect('/b');
    }
})

app.get('/s', (req, res) => {
    res.render('home');
})

app.get('/s/sell', (req, res) => {
    if (req.user) {
        req.logout((err) => {
            if (err) {
                throw new AppError('Error logging out', 400);
            }
            res.redirect('/s');
        })
    } else {
        res.redirect('/s');
    }
})

app.get('/error', (req, res) => {
    chicken.fly();
})

app.all('*', (req, res, next) => {
    next(new AppError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { status = 400, message = 'Bad Request' } = err;
    res.status(status).render('error', { status, message });
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
})