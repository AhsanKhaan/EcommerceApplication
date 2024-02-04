const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
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
    default: 3,
  },
  category: {
    type: String,
    required: true,
  },
  created_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Users',
  },
  status:{
    type:String,
    enum:['ACTIVE','INACTIVE','PENDING'],
    default:'PENDING',
  }
});

const Product = mongoose.model('Products', productSchema);

module.exports = Product;
