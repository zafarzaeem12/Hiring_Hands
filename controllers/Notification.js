const Notification = require('../model/Notification');

const Get_Notifications = async(req,res,next) => {
try{
    const data = [
        {
          '$lookup': {
            'from': 'posts', 
            'localField': 'Post_id', 
            'foreignField': '_id', 
            'as': 'Notifications'
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': 'Notifications.User_id', 
            'foreignField': '_id', 
            'as': 'user'
          }
        }, {
          '$unset': [
            'user.email', 'user.password', 'user.verification_code', 'user.is_verified', 'user.user_is_profile_complete', 'user.user_is_forgot', 'user.user_authentication', 'user.user_social_token', 'user.user_social_type', 'user.user_device_token', 'user.user_device_type', 'user.is_profile_deleted', 'user.is_notification', 'user.is_Blocked', 'user.createdAt', 'user.updatedAt', 'user.__v', 'user.business_phone_number', 'user.category', 'user.company_name', 'user.phone_number', 'user.role', 'Notifications.User_id'
          ]
        }
      ]
    const cat = await Notification.aggregate(data)
    res.status(200).send({
        total : cat.length,
        message:"Get all Notifications",
        data : cat
    })
}catch(err){
    res.status(404).send({
        message:"No categories found",
    })
}
}
module.exports = {
  
    Get_Notifications
}