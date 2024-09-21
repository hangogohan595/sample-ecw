module.exports.setOrigUrl = (req, res, next) => {
    req.session.returnTo = req.originalUrl;
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}