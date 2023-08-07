const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    Post_id:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
},
    { timestamps: true }
)
module.exports = mongoose.model("Notification", NotificationSchema);