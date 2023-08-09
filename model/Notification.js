const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    Post_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Posts'
    },
},
    { timestamps: true }
)
module.exports = mongoose.model("Notification", NotificationSchema);