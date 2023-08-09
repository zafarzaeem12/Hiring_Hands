const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    Post_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    Freelancer_User_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rated_by_User_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rating:{
        type : Number
    },
    description:{
        type : String
    }
},
    { timestamps: true }
)
module.exports = mongoose.model("Review", ReviewSchema);