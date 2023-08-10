const Chats = require('../model/Chats')

const Sending_Messages = async (object , callback) => {
    // const attachments = req?.files?.chat_attachment?.map((data) =>
    //   data?.path?.replace(/\\/g, "/")
    // );
    try {
      const messages = {
        message: object.message,
        chat_attachment: object.chat_attachment,
        sender_Id: object.sender_Id,
        reciever_Id: object.reciever_Id,
      };
      const chats = await Chats.create(messages);

      callback(chats)
    //   res.send({
    //     messages: "chat created",
    //     status: 200,
    //     data: chats,
    //   });
    } catch (err) {
        callback(err)
    //   res.send({
    //     messages: "No chat created",
    //     status: 404,
    //   });
    }
  };

const Getting_Messages = async (object , callback) => {
    const sender_Id = object.sender_Id
    const reciever_Id = object.reciever_Id
try{
   const get_messages = await Chats.find({$and : [{ sender_Id : sender_Id  } , {reciever_Id : reciever_Id }]}).populate('sender_Id').populate('reciever_Id')
   callback(get_messages)
}catch(err){
    callback(err)
}
}

  module.exports = {
    Sending_Messages,
    Getting_Messages
  }