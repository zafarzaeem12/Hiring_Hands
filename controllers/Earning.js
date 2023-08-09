
const Earning = require('../model/Earning');

const moment = require('moment')

const Get_Earning = async (req,res,next) => {
try{
    const data =  
    await Earning
    .find({ Freelancer_User_id : req.id})
    .populate('Post_id')

    res.status(200).send({
        message : "Your Earning History",
        data : data
    })

}catch(err){
    res.status(200).send({
        message : "No History found"
    })
}
}
module.exports = {
    Get_Earning
}