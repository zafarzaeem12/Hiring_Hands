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
        type : String,
        default : ""
    },
    end_time :{
        type : String,
        default : ""
    },
    freelancer_start_time :{
        type : String,
        default : ""
    },
    freelancer_job_accepted:{
        type : Boolean,
        default : false
    },
    freelancer_end_time :{
        type : String,
        default : ""
    },
    client_start_time :{
        type : String,
        default : ""
    },
    client_end_time :{
        type : String,
        default : ""
    },
    total_amount :{
        type :Number,
        default : 0
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
    
    ],
    is_Post_Deleted : {
        type : Boolean,
        default : false
    }
        
    
},
    { timestamps: true }
)
module.exports = mongoose.model("Posts", PostSchema);