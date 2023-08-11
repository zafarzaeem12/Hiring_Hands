const socketIoMiddleware = (io) => {
    io.on("connection", (socket) => {
      socket.on("Sending_Messages", function (object) {
        // Your Sending_Messages logic here
      });
  
      socket.on("Getting_Messages", function (object) {
        // Your Getting_Messages logic here
      });
  
      socket.on("Get_all_jobs", function (object) {
        // Your Get_all_jobs logic here
      });
  
      socket.on("Create_a_Jobs", function (object) {
        // Your Create_a_Jobs logic here
      });
    });
  };
  
  module.exports = socketIoMiddleware;
  