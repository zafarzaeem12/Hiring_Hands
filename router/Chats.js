const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Get_Last_Message
} = require('../controllers/Chats')

router.get('/chatlist' ,auth , File.user , Get_Last_Message);



module.exports = router