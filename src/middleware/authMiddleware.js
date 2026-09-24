const jwt = require('jsonwebtoken');
const response = require('../response');

const authenticateToken = (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token || !token.startsWith('Bearer ')) return response(401, null, "Unauthorized", res);

        const tokenString = token.split(' ')[1];
        const decodedToken = jwt.verify(tokenString, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    }
    catch (err) {
        next(err);
    }
}

module.exports = {
    authenticateToken
};