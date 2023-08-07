const Post = require("../model/Posts");
const Notification = require("../model/Notification")
const moment = require("moment");

const Create_a_Job = async (req, res, next) => {
  try {

     const check_role = await Post.findOne({ User_id: req?.id }).populate({
      path: "User_id",
      select: "role",
    });
    if (check_role.User_id.role === "Freelancer") {
      return res
        .status(404)
        .send({ message: "Your not allowed to Post a Job" });
    }
    const Data = {
      title: req.body.title,
      description: req.body.description,
      charges: req.body.charges,
      User_id: req.id,
      total_hours: req.body.total_hours,
      start_time: moment(req.body.start_time).format("YYYY-MM-DDThh:mm A"),
      end_time: moment(req.body.end_time).format("YYYY-MM-DDThh:mm A"),
      location: req.body.location,
      status: req.body.status || "Waiting Applicant",
    };

    const create_post = await Post.create(Data);

    const { _id  , ...other }  = create_post

    const Datas = {
        Post_id : _id
    }
    await Notification.create(Datas)
    res.status(200).send({
      message: "Job Created Successfully",
      data: create_post,
    });
  } catch (err) {
    res.status(500).send({
      message: "Job not Created",
    });
  }
};

const Get_all_Jobs = async (req, res, next) => {
    const Id  = req.id
  try {
    const cat = await Post.find({ User_id : Id }).populate({ path : 'User_id' ,select:'user_image name state' }) ;
    res.status(200).send({
      total: cat.length,
      message: "Get all categories",
      data: cat,
    });
  } catch (err) {
    res.status(404).send({
      message: "No categories found",
    });
  }
};
module.exports = {
  Create_a_Job,
  Get_all_Jobs,
};
