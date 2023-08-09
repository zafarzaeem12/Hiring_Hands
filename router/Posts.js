const router = require('express').Router();
const auth = require('../middleware/Authentication');
const File = require('../middleware/ImagesandVideosData');
const { 
    Create_a_Job ,
    Get_Employer_Specfic_Jobs,
    Get_all_jobs,
    Applied_For_Job,
    Get_one_Post,
    Assiging_Job,
    Is_Job_Completed,
    Job_Details_For_Freelancer,
    Freelancer_Projects_In_Progree
} = require('../controllers/Posts')

router.post('/create' ,auth , Create_a_Job);
router.get('/get' , auth  , Get_Employer_Specfic_Jobs );
router.get('/gets' , auth , Get_all_jobs);
router.put('/applied_job/:id' , auth , Applied_For_Job);
router.get('/getpost/:id' , auth , Get_one_Post);
router.put('/accept_job/:id' , auth ,File.user  , Assiging_Job);
router.put('/complete_job/:id' , auth ,File.user  , Is_Job_Completed);
router.get('/postdetails/:id' , auth , Job_Details_For_Freelancer );
router.get('/in_progress_status' , auth ,Freelancer_Projects_In_Progree);



module.exports = router