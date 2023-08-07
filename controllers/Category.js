const Category = require('../model/Category');

const Register_Category = async (req,res,next) => {
try{
    const Data = {
        name : req.body.name
    }
    const create_category = await Category.create(Data)
    res.status(200).send({
        message : "Category Created Successfully",
        data : create_category
    })
}catch(err){
    res.status(404).send({
        message : "Category not Created"
    })
}
}

const Get_Category = async(req,res,next) => {
try{
    const cat = await Category.find();;
    res.status(200).send({
        total : cat.length,
        message:"Get all categories",
        data : cat
    })
}catch(err){
    res.status(200).send({
        message:"No categories found",
    })
}
}
module.exports = {
    Register_Category,
    Get_Category
}