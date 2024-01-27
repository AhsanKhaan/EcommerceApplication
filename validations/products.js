const { check, validationResult } = require('express-validator');

const getAllProducts=[
    check('category').optional().isAlpha().withMessage('Valid Category is required.'),
];
const createProductValidation=[
    check('category').optional().isAlpha().withMessage('Valid Category is required.'),
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