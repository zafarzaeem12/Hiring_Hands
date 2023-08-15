const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Add_Payment
} = require('../controllers/Payment')

router.post('/createPayment' ,auth , File.user , Add_Payment);




module.exports = router