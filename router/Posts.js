const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Create_a_Job ,
    Get_all_Jobs
} = require('../controllers/Posts')

router.post('/create' ,auth , Create_a_Job);
router.get('/get' , auth  , Get_all_Jobs );


module.exports = router