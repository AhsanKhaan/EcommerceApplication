const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
  },
  stock: {
    type: Number,
    required: true,
  },
  maxQuantityPerOrder: {
    type: Number,
    default: 10,
  },
  category: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model('Products', productSchema);

module.exports = Product;
