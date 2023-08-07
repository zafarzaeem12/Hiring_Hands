const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Register_Category ,
    Get_Category
} = require('../controllers/Category')

router.post('/create' , File.user , Register_Category);
router.get('/get' ,File.upload , Get_Category );


module.exports = router