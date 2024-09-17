const jwt = require('jsonwebtoken');

const basicAuth = (req, res, next) => {
    const authCookie = req.cookies.auth;
    if (!authCookie) {
        res.redirect('/login');
        return;
    }
    jwt.verify(authCookie, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.redirect('/login');
        }
        next();
    });
};

module.exports = basicAuth;
