const Chats = require('../model/Chats');

const Get_Last_Message = async (req,res,next) => {
    const sender_Id = req.id
try{
    const get_msg = await Chats.find({ sender_Id : sender_Id}).populate({path: 'reciever_Id' , select:" name user_image"}).sort({ createdAt : -1 })
    res.status(200).send({ message : "Message Fetched" , data :get_msg })
}catch(err){
    res.status(500).send({ message : "Message Not Fetched" })
}
}

const Your_Attachments = (req,res,next) => {
    const attachments = req?.files?.chat_attachment?.map((data) =>
      data?.path?.replace(/\\/g, "/")
    );
    const Data = {
        chat_attachment : attachments
    }

    res.status(200).send({ data : Data })
}

module.exports = {
    Get_Last_Message,
    Your_Attachments
}