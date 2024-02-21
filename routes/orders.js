const { response } = require('express');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Orders=require('../models/orders');
const { createOrdersValidation, getAllOrdersValidation } = require('../validations/orders');
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API operations related to orders
 */

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *      - Auth: []
 *     requestBody:
 *      required: false
 *      content:
 *        application/json:
 *          example:
 *            status: "PENDING" 
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               status: "PENDING"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', [auth(['user']),getAllOrdersValidation], async (request, response) => {
    //File upload configuration using Multer
    // const storage = multer.memoryStorage();
    // const upload = multer({ storage: storage });
  const { status } = request.body;
  let orders;
  
  try {
    if(status){
      orders = await Orders.find({ status });

    }
    orders = await Orders.find({});

    if (orders?.length > 0) {
      return response.status(200).json({
        Orders: orders,
        totalCount: orders?.length || 0
      });
    } else {
      if(orders){
        return response.status(200).json({
          msg: "No Orders found",
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
 * /api/v1/orders/create:
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

router.post('/create', [auth(['vendor']), createOrdersValidation], async (request, response, next) => {
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
