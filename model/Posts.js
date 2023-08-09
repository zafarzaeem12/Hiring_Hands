const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    charges:{
        type: String
    },
    total_hours:{
        type : Number
    },
    start_time :{
        type : String
    },
    total_amount :{
        type :Number,
        default : 0
    },
    end_time :{
        type : String
    },
    location: {
        type: {
          type: String,
          enum: ['Point', 'Polygon']
        },
        coordinates: [Number] 
      },
    status:{
        type : String,
        enum : ['Waiting Applicant','In Progress' , 'Complete'],
        default: 'Waiting Applicant'
    },
    User_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Freelancer_User_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    applied_For_Jobs:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          }
    
    ]
        
    
},
    { timestamps: true }
)
module.exports = mongoose.model("Posts", PostSchema);