const verifyLoggedIn = (req, res, next) => {
    if (req.session.accessToken || req.url === '/register' || req.url === '/login') {
        next();
    } else {
        res.render('login', { message: null });
    }
};
module.exports = verifyLoggedIn;