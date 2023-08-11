const Post = require("../model/Posts");
const User = require('../model/Users')
const Notification = require('../model/Notification')
const moment = require("moment");
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

  const Create_a_Job = async (object , callback) => {
    try {
      const check_role = await Post.findOne({ User_id: object?._id }).populate({
        path: "User_id",
        select: "role",
      });
      if (check_role && check_role.User_id.role === "Freelancer") {
        return res
          .status(404)
          .send({ message: "Your not allowed to Post a Job" });
      }
      console.log("1234");
      const Data = {
        title: object.title,
        description: object.description,
        charges: object.charges,
        User_id: object.id,
        total_hours: object.total_hours,
        start_time: moment(object.start_time).format("YYYY-MM-DDThh:mm A"),
        end_time: moment(object.end_time).format("YYYY-MM-DDThh:mm A"),
        location: object.location,
        status: object.status || "Waiting Applicant",
      };
  
      const create_post = await Post.create(Data);
  
      const { _id, ...other } = create_post;
  
      const Datas = {
        Post_id: _id,
      };
      await Notification.create(Datas);
     callback(create_post)
  
      // res.status(200).send({
      //   message: "Job Created Successfully",
      //   data: create_post,
      // });
    } catch (err) {
      callback(err)
      // res.status(500).send({
      //   message: "Job not Created",
      // });
    }
  };


  module.exports = {
    Get_all_jobs,
    Create_a_Job
  }