const { body, validationResult } = require('express-validator');
const response = require('../response');

const validateTask = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response(400, null, errors.array()[0].msg, res);
        }
        next();
    }
];

module.exports = validateTask;
