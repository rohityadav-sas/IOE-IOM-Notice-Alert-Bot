const jwt = require('jsonwebtoken');
require('dotenv').config();

const basicAuth = (req, res, next) => {
    const authCookie = req.cookies.auth;
    if (!authCookie) {
        if (Object.keys(req.query).length !== 0) {
            const { token } = req.query;
            return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.redirect('/login');
                }
                return next();
            });
        } else {
            return res.redirect('/login');
        }
    }
    jwt.verify(authCookie, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect('/login');
        }
        return next();
    });
};

module.exports = basicAuth;
