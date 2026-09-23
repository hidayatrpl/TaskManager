const response = require('../response');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    return response(500, null, err.message || "Internal Server Error", res);
}

module.exports = errorHandler;