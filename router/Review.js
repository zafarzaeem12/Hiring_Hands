const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Create_a_Review ,
    // Get_Payment
} = require('../controllers/Review')

router.post('/create' ,auth , File.user , Create_a_Review);
//router.get('/get' , auth ,File.upload , Get_Payment );


module.exports = router