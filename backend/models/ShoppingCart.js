const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the schema for the shopping cart
const cartShema = new Schema({
    buyerEmail: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
        maxlength: 100,
    },
    itemID : {
        type : String,
        required: true,
        trim: true,  // Trims any whitespace
        match: [/^[a-zA-Z0-9]*$/, 'Invalid item ID'] 
    },
    supplierId : {
        type : String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
        maxlength: 100,
    },
    productName : {
        type : String,
        required : true,
        maxlength: 255
    },
    productQty : {
        type : Number,
        required: true

    },
    price : {
        type : Number,
        required : true
    }, 
    Image:{
      data: Buffer,
      contentType: [String],
    }
})

// Create a model using the schema
const ShoppingCart = mongoose.model("ShoppingCart",cartShema);

// Export the model for use in other files
module.exports = ShoppingCart;

