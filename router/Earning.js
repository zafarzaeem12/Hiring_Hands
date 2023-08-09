const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Get_Earning
} = require('../controllers/Earning')

router.get('/earning' ,auth , File.user , Get_Earning);



module.exports = router