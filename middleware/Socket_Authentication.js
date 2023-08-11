var io = require('socket.io')();
var jwtAuth = require('socketio-jwt-auth');
const User = require('../model/Users')
const Socket_Authentication = (req,res,next) => {
try{
    io.use(jwtAuth.authenticate({
        secret: process.env.SOCKET_SCERET_KEY,    // required, used to verify the token's signature
        algorithm: 'HS256'        // optional, default to be HS256
      }, function(payload, done) {
        // done is a callback, you can use it as follows
        console.log("object",payload)
        User.findOne({id: payload.sub}, function(err, user) {
          if (err) {
            console.log("err",err)
            // return error
            return done(err);
          }
          if (!user) {
            console.log("user",user)
            // return fail with an error message
            return done(null, false, 'user does not exist');
          }
          // return success with a user info
          console.log(user)
          return done(null, user);
        });
      }));

}catch(err){
    console.log(err)
}

}

module.exports = Socket_Authentication