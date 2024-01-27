const { response } = require('express');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Products=require('../models/products');
const { createQuestionsValidations, getAllProducts } = require('../validations/products');
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API operations related to products
 */

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *      - Auth: []
 *     requestBody:
 *      required: false
 *      content:
 *        application/json:
 *          example:
 *            category: "electronics" 
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               category: "electronics"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', getAllProducts, async (request, response) => {

  const { category } = request.body;
  let products;
  console.log('ssss', category);
  try {
    if(category){
      products = await Products.find({ category });

    }
    products = await Products.find({});

    if (products?.length > 0) {
      return response.status(200).json({
        products: products,
        totalCount: products?.length || 0
      });
    } else {
      if(category){
        return response.status(200).json({
          msg: "No Products found Against Category!",
          totalCount: 0
        });
      }else{
        return response.status(200).json({
          msg: "No Prodcuts found!",
          totalCount: 0
        });
      }
    }


  } catch (error) {
    console.error(error.message);
    response.status(500).json({ msg: error.message });
  }
});

/**
 * @swagger
 * /api/v1/products/create:
 *   post:
 *     summary: Create a new Product
 *     tags: [Products]
 *     security:
 *      - Auth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             text: "What is your question?"
 *             options: [{ id: 1, text: "Option 1" }, { id: 2, text: "Option 2" }]
 *             correctOption: [1]
 *             courseType: "Math"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               msg: "Product inserted Successfully!"
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */

router.post('/create', [auth, createQuestionsValidations], async (request, response, next) => {
  const { text, courseType } = request.body;

  let question = await Question.findOne({ text, courseType });
  if (question) {
    return response.status(400).json({
      msg: 'Question already exists',
    });
  }

  try {
    question = new Question(request.body);
    await question.save();

    return response.status(200).json({
      msg: 'Question inserted Succesfully! in course:  ' + courseType,
    });

  } catch (error) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error!' });
  }



});


module.exports = router;
