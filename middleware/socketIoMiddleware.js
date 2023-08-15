const { Sending_Messages , Getting_Messages } = require('../utils/chats')
const { Get_all_jobs , Create_a_Job } = require('../utils/posts')
const { Create_a_Jobs } = require('../controllers/Posts')
const push_notifications = require('./push_notification')
const UserModal = require('../model/Users')
const socketIoMiddleware = (io) => {

  io.on("connection", (socket) => {

    socket.on("Sending_Messages", function (object) {
      const senderID = object.sender_Id;
      const reciverID = object.reciever_Id;
      const room = `room person1 ${senderID} and person ${reciverID} `;
      socket.join(room);
  
      Sending_Messages(object, async function (response) {
        console.log('===========>',response)
        const receiver_object = await UserModal.find({ _id: object.reciever_Id });
        const sender_object = await UserModal.find({ _id: object.sender_Id });
  
        let receiver_device_token = "";
        let receiver_name = "";
        let is_notification_reciever = " ";
        for (let i = 0; i < receiver_object.length; i++) {
          receiver_device_token = receiver_object[i].user_device_token;
          receiver_name = receiver_object[i].name;
          is_notification_reciever = receiver_object[i].is_notification;
        }
  
      let sender_device_token = "";
      let sender_name = "";
      let sender_image = "";
     
      // let sender_id = "";
      for (let i = 0; i < sender_object.length; i++) {
        sender_device_token = sender_object[i].user_device_token;
        sender_name = sender_object[i].name;
        sender_image = sender_object[i].user_image;
    
        // sender_id = sender_object[i]._id;
      }
  
      const notification_obj_receiver = {
        to: receiver_device_token,
        title: receiver_name,
        body: `${sender_name} has send you a message.`,
        notification_type: 'msg_notify',
        vibrate: 1,
        sound: 1,
        sender_id: object.sender_Id,
        sender_name: sender_name,
        sender_image: sender_image,
        sender_message : response.message
      };
  console.log("checking....", notification_obj_receiver)
      if (receiver_object[0].is_notification === true) {
        // console.log("######" , receiver_object)
      push_notifications(notification_obj_receiver);
    }
  
        // console.log("response",response)
        io.to(room).emit("new_message", {
          object_type: "sending_Messages",
          message: response,
        });
      });
    });
  
    socket.on("Getting_Messages", function (object) {
      const senderID = object.sender_Id;
      const reciverID = object.reciever_Id;
      const room = `room person1 ${senderID} and person ${reciverID} `;
      socket.join(room);
  
      Getting_Messages(object, async function (response) {
        // console.log("response",response)
        io.to(room).emit("new_message", {
          object_type: "sending_Messages",
          message: response,
        });
      });
    });
  
    socket.on("Get_all_jobs", function (object) {
      const  in_User = object._id
     
      const room = `room person1 ${in_User} and person ${in_User} `;
      socket.join(room);
  
      Get_all_jobs(object, async function (response) {
        
        io.to(room).emit("get_all_jobss", {
          object_type: "jobs",
          data: response,
        });
      });
    });
   
    socket.on("Create_a_Jobs", function (object) {
      const  in_User = object._id
     
      const room = `room person1 ${in_User} and person ${in_User} `;
       socket.join(room);
  
      Create_a_Jobs(object, async function (response) {
        io.to(room)
        return response;
        // io.to(room).emit("get_all_jobss", {
        //   object_type: "jobs",
        //   data: response,
        // });
  
      });
  
  
  
    });
  
  })
  };
  
  module.exports = socketIoMiddleware;
  