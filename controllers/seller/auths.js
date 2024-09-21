const Seller = require('../../models/seller');

module.exports.renderSignup = (req, res) => {
    res.render('seller/auths/signup');
}

module.exports.submitSignup = async (req, res, next) => {
    try {
        const { email, username, password } = req.body.seller;
        const seller = new Seller({ username, email });
        const newSeller = await Seller.register(seller, password);
        req.login(newSeller, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to ECW');
            res.redirect('/s/stores');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/s/signup');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('seller/auths/login');
}

module.exports.submitLogin = (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = res.locals.returnTo || '/s/stores';
    res.redirect(redirectUrl);
}

module.exports.submitLogout = (req, res) => {
    req.logout((err) => {
        if (err) {
            throw new AppError('Error logging out', 400);
        }
        req.flash('success', 'Successfully logged out');
        res.redirect('/s/login');
    })
}