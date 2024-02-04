const { response } = require('express');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Products=require('../models/products');
const { createProductValidation, getAllProducts } = require('../validations/products');
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
  
  try {
    if(category){
      products = await Products.find({ category });

    }
    products = await Products.find({}).select('-created_by -status');

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
 *             name: "Head Phone"
 *             description: "This is Wireless Headphone"
 *             price: 10
 *             stock: 100
 *             maxQuantityPerOrder: 2
 *             category: "Electronics"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               msg: "Product inserted Successfully!"
 *       400:
 *         description: Bad Request
 *       403:
 *         description: You Don't Have Access this Resource
 *       500:
 *         description: Internal server error
 */

router.post('/create', [auth(['vendor']), createProductValidation], async (request, response, next) => {
  const { name,
          description,
          price,
          images,
          stock,
          maxQuantityPerOrder,
          category
        } = request.body;

  let product = await Products.findOne({ name });
  if (product) {
    return response.status(400).json({
      msg: 'Product already exists',
    });
  }

  try {
    product = new Products({ 
      name,
      description,
      price,
      images,
      stock,
      maxQuantityPerOrder,
      category,
      created_by:request.user.id
    });
    await product.save();

    return response.status(200).json({
      msg: 'Product Added  Succesfully!',
    });

  } catch (error) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error!' });
  }



});


module.exports = router;
