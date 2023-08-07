const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    company_name: {
        type: String,
    },
    category:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    email: {
        type: String,
    },
    password: {
        type: String,
        // unique: true,
        // required: true
    },
    user_image: {
        type: String,
    },
    phone_number: {
        type: String,
        // required: true
    },
    business_phone_number: {
        type: String,
        // required: true
    },
    role:{
        type:String,
        enum : ['Client','Freelancer'],
        default: 'Freelancer'
    },
    state: {
        type: String,
    },
    verification_code :{
        type:Number,
        default : 0
    },
    is_verified :{
        type: Boolean,
        default : false
    },
    user_is_profile_complete :{
        type: Boolean,
        default : false
    },
    user_is_forgot :{
        type: Boolean,
        default : false
    },
    user_authentication: {
        type: String,
        default : ""
    },
    user_social_token: {
        type: String,
    },
    user_social_type: {
        type: String,
    },
    user_device_token: {
        type: String,
        default : "",
    },
    user_device_type: {
        type: String,
        required : true
        
    },
    is_profile_deleted :{
        type: Boolean,
        default : false
    },
    is_notification :{
        type: Boolean,
        default : false
    },
    is_Blocked :{
        type: Boolean,
        default : false
    },
    user_social_token:{
        type : String,
        default : '12345'
    },
    user_social_type:{
        type:String,
        enum : ['Facebook','Google','Apple','none'],
        default: 'none'
    }
},
    { timestamps: true }
)
module.exports = mongoose.model("User", UserSchema);