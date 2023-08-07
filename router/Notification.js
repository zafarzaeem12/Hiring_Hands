const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Get_Notifications
} = require('../controllers/Notification')

router.get('/get' ,File.upload , Get_Notifications );


module.exports = router