const Review = require('../model/Review')

const Create_a_Review = async (req,res,next) => {
try{
    const Data = {
        Post_id : req.body.Post_id,
        rated_User_id : req.body.rated_User_id,
        rating : req.body.rating,
        description  : req.body.description
    }

    const rating = await Review.create(Data)

    res.status(200).send({ message : "Rating Add Successfully" , data : rating })
}catch(err){
    res.status(500).send({ message : "No Rating"})
}
}

module.exports = {
    Create_a_Review
}