const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    message: {
        type: String,
    },
    chat_attachment : {
        type: Array
    },
    sender_Id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    reciever_Id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    group_Id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Group'
    },
    last_conversation : {
        type : Object
    }
},
    { timestamps: true }
)
module.exports = mongoose.model("Chat", ChatSchema);