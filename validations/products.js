const { check,body, validationResult } = require('express-validator');

const getAllProducts=[
    check('category').optional().isAlpha().withMessage('Valid Category is required.'),
];
const createProductValidation=[
    body('name','Invalid!!').matches('^([a-zA-Z ]+)$').withMessage('Valid Name is required.'),
    check('description').optional().isString().withMessage('Description Should Be Valid.'),
    check('price').isFloat().withMessage('Price Should be Number.'),
    check('images').optional().isArray({min:1,max:8}).withMessage('Upload 1-8 Images'),
    check('stock').isNumeric().withMessage('Stock Should be a Valid Number!'),
    check('maxQuantityPerOrder').isNumeric().withMessage('Valid Quantity Per Order is required.'),
    check('category').isAlpha().withMessage('Valid Category is required.')
];

const validateRequest = (validations) => {
    return async (req, res, next) => {
      await Promise.all(validations.map(validation => validation.run(req)));
  
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }
  
      return res.status(400).json({ errors: errors.array() });
    };
  };
module.exports ={
    getAllProducts:validateRequest(getAllProducts),
    createProductValidation:validateRequest(createProductValidation),
}