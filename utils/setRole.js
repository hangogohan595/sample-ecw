module.exports.setUserTypeMiddleware = (req, res, next) => {
    if (req.originalUrl.includes('/b')) {
        req.session.userType = 'buyer';
    } else if (req.originalUrl.includes('/s')) {
        req.session.userType = 'seller';
    }
    res.locals.userType = req.session.userType;
    next();
}