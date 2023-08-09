const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Get_Earning
} = require('../controllers/Earning')

router.get('/history' ,auth , Get_Earning);



module.exports = router