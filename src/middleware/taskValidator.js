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

const validateRegister = [
    body('username').notEmpty().withMessage('Username is required').isString().withMessage('Username must be a string'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email address').isString().withMessage('Email must be a string'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response(400, null, errors.array()[0].msg, res);
        }
        next();
    }
]

const validateLogin = [
    body('username').notEmpty().withMessage('Username is required').isString().withMessage('Username must be a string'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return response(400, null, errors.array()[0].msg, res);
        }
        next();
    }
];

module.exports = {
    validateTask,
    validateRegister,
    validateLogin
};
