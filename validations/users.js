const { check, validationResult } = require('express-validator');

const createUserValidation = [
    check('username').notEmpty().withMessage('username is Required!'),
    check('email').isEmail().withMessage('Email is required.'),
    check('password').isLength({ min: 6 }).withMessage('Password must contain 6 Characters'),
    // check('password').isStrongPassword().withMessage('Password must be strong (include uppercase, lowercase, number, and special character).'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error(errors.array())
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const userLoginValidation = [
    check('email').isEmail().withMessage('Email is required.'),
    check('password').isLength({ min: 6 }).withMessage('Password must contain 6 Characters'),
    // check('password').isStrongPassword().withMessage('Password must be strong (include uppercase, lowercase, number, and special character).'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error(errors.array())
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports ={
    createUserValidation,
    userLoginValidation
}