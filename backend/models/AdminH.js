const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminHSchema = new Schema({
  email: {
    type: String,
    required: true,
  },

  hpw: {
    type: String,
    required: true,
  },
});

const AdminH = mongoose.model("AdminH", adminHSchema);

module.exports = AdminH;
