const {check,validationResult} = require('express-validator');

const getAllOrdersValidation=[

];
const createOrdersValidation=[
    check('orderId').notEmpty().isString().withMessage('orderId is Required!'),
    check('customerId').notEmpty().isMongoId().withMessage('customerId is Required!'),
    check('products').notEmpty().isArray().withMessage('products is Required!'),
    check('deliveryAddress').notEmpty().isAlphanumeric().withMessage('deliveryAddress is Required!')
];

const validateRequest=(validations)=>{
    return async (request,response,next)=>{
        await Promise.all(validations.map((validation)=>{validation.run(request)}));

        const errors = validationResult(request);
        if (errors.isEmpty()) {
          return next();
        }
    
        return res.status(400).json({ errors: errors.array() });

    }
}

module.exports = {
    getAllOrdersValidation : validateRequest(getAllOrdersValidation),
    createOrdersValidation : validateRequest(createOrdersValidation)
}