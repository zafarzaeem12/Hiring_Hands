const mongoose = require('mongoose');

const EarningSchema = new mongoose.Schema({
 
    Freelancer_User_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Post_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    total_earning:{
        type: Number,
        default : 0
    }

},
    { timestamps: true }
)
module.exports = mongoose.model("Earning", EarningSchema);