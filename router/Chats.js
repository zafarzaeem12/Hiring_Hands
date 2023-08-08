const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Get_Last_Message,
    Your_Attachments
} = require('../controllers/Chats')

router.get('/chatlist' ,auth , File.user , Get_Last_Message);
router.post('/attach' ,  File.upload , Your_Attachments  )



module.exports = router