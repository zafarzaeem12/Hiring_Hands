const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Create_a_payment ,
    Get_Payment
} = require('../controllers/Payment')

router.post('/create' ,auth , File.user , Create_a_payment);
router.get('/get' , auth ,File.upload , Get_Payment );


module.exports = router