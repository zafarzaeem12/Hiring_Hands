const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    Post_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    rated_User_id:{
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