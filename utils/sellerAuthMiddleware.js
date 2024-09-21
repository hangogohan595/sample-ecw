const AppError = require("./AppError");
const Store = require('../models/store');

module.exports = async function (req, res, next) {
  if (!req.isAuthenticated()) {
    if (req.path === '/s/logout') {
      req.flash('error', 'Already logged out');
      return res.redirect('/s/login');
    } else if ((req.path !== '/s/login') && (req.path !== '/s/signup')) {
      req.flash('error', 'You must be signed in');
      return res.redirect('/s/login');
    }
    next();
  } else {
    if (!req.params.id) {
      if (req.originalUrl === '/s/signup' || req.originalUrl === '/s/login') {
        return res.redirect('/s/stores');
      }
      next();
    } else {
      const store = await Store.findById(req.params.id);
      if (store.seller.toString() !== req.user.id) {
        req.flash('error', 'Store not found');
        return res.redirect('/s/stores');
      }
      next();
    }
  }
}