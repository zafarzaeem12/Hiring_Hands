
const Earning = require('../model/Earning');

const moment = require('moment')

const Get_Earning = async (req,res,next) => {
    
    const User_Id = req.id
    console.log("3333",User_Id)
try{
    const data = await 
    Earning
    .find({ Freelancer_User_id: User_Id })
    .populate({ path :'Post_id' , select : "title start_time"})

    const totalearning = data.map((item) => item?.earning).reduce((acc,item) => acc + item)
    
    res.status(200).send({
        message : "Your Earning History",
        data : {data , totalearning}
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