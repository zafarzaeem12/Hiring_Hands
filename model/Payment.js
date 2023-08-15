const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
 
    Freelancer_User_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    User_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Card_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    total_amount:{
        type: Number,
        default : 0
    }

},
    { timestamps: true }
)
module.exports = mongoose.model("Payment", PaymentSchema);