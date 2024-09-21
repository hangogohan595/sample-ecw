const AppError = require("./AppError");

module.exports = async function (req, res, next) {
  if (!req.isAuthenticated()) {
    if (req.path === '/b/logout') {
      req.flash('error', 'Already logged out');
      return res.redirect('/b/login');
    } else if ((req.path !== '/b/login') && (req.path !== '/b/signup')) {
      req.flash('error', 'You must be signed in');
      return res.redirect('/b/login');
    }
    next();
  } else {
    next();
  }
}