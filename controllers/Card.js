
const Card = require('../model/Card');
const Posts = require('../model/Posts')
const moment = require('moment')

const Add_Card = async (req,res,next) => {
try{

    const already = await Card.findOne({ card_number :  req.body.card_number })
    if(already && already.card_number === req.body.card_number){
        return res.status(404).send({ message : "This is Card is already attached"})
    }

     
        const Data = {
            card_holder_name : req.body.card_holder_name,
            card_number : req.body.card_number,
            expiry_date : moment(req.body.expiry_date).format("YYYY-MM-DDThh:mm A"),
            code : req.body.code
    
        }
        const create_payment = await Card.create(Data)
       return res.status(200).send({
            message : "Card Added Successfully",
            data : create_payment
        })

    
}catch(err){
    res.status(404).send({
        message : "Payment not Created"
    })
}
}

const Get_All_Cards = async (req,res,next) => {
    try{
        const data = await Card.find()
        res.status(200).send({ total : data.length , message :"Card Data Fetched" , data:data })
    }catch(err){
        res.status(500).send({ message :"No Card Found"})
    }
}

const Create_a_payment = async (req,res,next) => {
try{
const Data = {

}
}catch(err){
    console.log(err)
}
}
module.exports = {
    Add_Card,
    Get_All_Cards,
    Create_a_payment
}