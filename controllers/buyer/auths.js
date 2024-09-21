const Buyer = require('../../models/buyer');

module.exports.renderSignup = (req, res) => {
    res.render('buyer/auths/signup');
}

module.exports.submitSignup = async (req, res, next) => {
    try {
        const { firstName, lastName, phone, address, email, username, password } = req.body.buyer;
        const buyer = new Buyer({ firstName, lastName, phone, address, email, username });
        const newBuyer = await Buyer.register(buyer, password);
        req.login(newBuyer, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to ECW');
            res.redirect('/b/products');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/b/signup');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('buyer/auths/login');
}

module.exports.submitLogin = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/b/products';
    res.redirect(redirectUrl);
}

module.exports.submitLogout = (req, res) => {
    req.logout((err) => {
        if (err) {
            throw new AppError('Error logging out', 400);
        }
        req.flash('success', 'Successfully logged out');
        res.redirect('/b/login');
    })
}