const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({

  productId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  }, 
  price: {
    type: Number,
    required: true
  },
  quantity:{
    type: Number,
    required: true
  }, 
  image:{
    data: Buffer,
    contentType:String,
    required: true
  }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
