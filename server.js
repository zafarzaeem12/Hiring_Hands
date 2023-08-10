const express = require("express");
const path = require('path');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const databaseConnection = require('./database/databaseConnection')
const push_notifications = require('./middleware/push_notification')
const { Sending_Messages , Getting_Messages } = require('./utils/chats')
const { Get_all_jobs } = require('./utils/posts')
// app routes start here
const UserRouter = require('./router/Users')
const CategoryRouter = require('./router/Category')
const PostRouter = require('./router/Posts')
const NotificationRouter = require('./router/Notification');
const CardRouter = require('./router/Card')
const ReviewRouter = require('./router/Review')
const ChatRouter = require('./router/Chats')
const EarningRouter = require('./router/Earning')
const UserModal = require('./model/Users')
// const GoalsRouter = require('./router/Goals')
// const Save_Types = require('./router/Save_Types')
// app routes end here

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.json());
app.use(cors());

// app routes use here
app.use("/UserAPI/", UserRouter);
app.use("/CategoryAPI/", CategoryRouter);
app.use("/PostAPI/", PostRouter);
app.use("/NotificationAPI/", NotificationRouter);
app.use("/CardAPI/", CardRouter);
app.use("/ReviewAPI/", ReviewRouter);
app.use("/ChatAPI/", ChatRouter);
app.use("/EarningAPI/", EarningRouter);
// app.use("/Save_TypesAPI/", Save_Types);

// routes end here

dotenv.config();

const port = process.env.PORT;

// database connection start here
databaseConnection()
// database connection end here


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
      // console.log("response",response)
      io.to(room).emit("get_all_jobs", {
        object_type: "jobs",
        data: response,
      });
    });
  });

})

http.listen(port, () => {
  console.log(`Server is running on ${port} Port`);
});