const Post = require("../model/Posts");
const User = require('../model/Users')
const Get_all_jobs = async (object , callback) => {
    try {
      const allFreelancer = await User.findById(object._id);
      const allJobs = 
      await 
      Post
      .find({status : 'Waiting Applicant'})
      .select("-applied_For_Jobs");
    
      callback( {allFreelancer , allJobs} )
    } catch (err) {
        callback(err)
    }
  };


  module.exports = {
    Get_all_jobs
  }