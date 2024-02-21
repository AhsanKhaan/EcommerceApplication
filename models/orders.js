const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId:{
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    default: 0,
  },
  deliveryAddress: {
    type: String,
    required: true,
  },
  deliveryCharges: {
    type: Number,
    default: 0,
  },
  orderStatus: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING',
  },
},{timestamps:true});

orderSchema.pre('save',async (next)=>{

    if(!this.orderId){
      this.orderId =new Date().getTime().toString(36).toUpperCase();
    }

    try {
      // Calculate totalPrice based on products' prices and quantities
      const products = await this.populate('products.product').execPopulate();
      let total = 0;
  
      products.products.forEach((item) => {
        total += item.product.price * item.quantity;
      });
  
      this.totalPrice = total;
      next();
    } catch (error) {
      next(error);
    }
});
const Order = mongoose.model('Orders', orderSchema);

module.exports = Order;
