const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    Post_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Posts'
    },
     title:{
        type : String,
       
    },
    description:{
        type : String,
       
    },
    start_time:{
        type : String,
       
    },
    end_time:{
        type : String,
       
    },
    charges:{
        type : Number,
       
    },
     User_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
     Freelancer_User_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message :{
        type : String,
        default :""
    }
     
    
},
    { timestamps: true }
)
module.exports = mongoose.model("Notification", NotificationSchema);