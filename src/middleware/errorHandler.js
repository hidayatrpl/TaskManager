const response = require('../response');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return response(statusCode, null, message, res);
}

module.exports = errorHandler;