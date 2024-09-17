const basicAuth = (req, res, next) => {
    const authCookie = req.cookies.auth;
    if (authCookie === 'authenticated') {
        return next();
    } else {
        return res.redirect('/login');
    }
};

module.exports = basicAuth;
