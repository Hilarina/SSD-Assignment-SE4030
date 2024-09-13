const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellerHSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
    required: true,
  },

  delChrg: {
    type: Number,
    required: true,
  },

  hpw: {
    type: String,
    required: true,
  },
});

const SellerH = mongoose.model("SellerH", sellerHSchema);

module.exports = SellerH;
