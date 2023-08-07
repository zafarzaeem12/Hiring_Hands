const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  card_holder_name:{
    type: String
  },
  card_number:{
    type: String
  },
  expiry_date:{
    type: String
  },
  code:{
    type: String
  }
},
    { timestamps: true }
)
module.exports = mongoose.model("Payment", PaymentSchema);