const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Add_Card ,
    Get_All_Cards
} = require('../controllers/Card')

router.post('/cardAdd' ,auth , File.user , Add_Card);
router.get('/getallcard' , auth ,File.upload , Get_All_Cards );



module.exports = router