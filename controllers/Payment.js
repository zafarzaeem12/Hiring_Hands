const Payment = require('../model/Payment');
const Card = require('../model/Card');
const Notification = require('../model/Notification')

const Add_Payment = async (req,res,next) => {
    try{
        const Data = {
            Card_id : req.body.Card_id,
            total_amount : req.body.total_amount,
            Freelancer_User_id : req.body.Freelancer_User_id,
            User_id : req.body.User_id
        }
        const Card_Details = await Card.findOne({ _id :  req.body.Card_id}).select("-code")

        const pay = await Payment.create(Data);
        const Datas = {
            Freelancer_User_id : req.body.Freelancer_User_id,
            User_id : req.body.User_id,
            message : "Your payment is successfully paid"
        }
        await Notification.create(Datas);

        res.status(200).send({ message : "Payment created successfully" , data : {Card_Details , pay} })

    }catch(err){
        res.status(404).send({ message : "No Payment found" })
    }
}

module.exports = {
    Add_Payment
}