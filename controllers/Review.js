const Review = require('../model/Review')
const Earning = require('../model/Earning')
const Post = require('../model/Posts')
const Create_a_Review = async (req,res,next) => {
try{

    const Data = {
        Post_id : req.body.Post_id,
        Freelancer_User_id : req.body.Freelancer_User_id,
        rated_by_User_id : req.body.rated_by_User_id,
        rating : req.body.rating,
        description  : req.body.description
    }

    
    const Datas = {
        Freelancer_User_id : Data.Freelancer_User_id,
        Post_id : Data.Post_id

    }
    const rating = await Review.create(Data)
    const earning = await Earning.create(Datas)

    res.status(200).send({ message : "Rating Add Successfully" , data : {rating , earning}  })
}catch(err){
    res.status(500).send({ message : "No Rating"})
}
}

module.exports = {
    Create_a_Review
}