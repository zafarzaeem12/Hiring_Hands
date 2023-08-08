const Post = require("../model/Posts");
const mongoose = require("mongoose");
const User = require("../model/Users");
const Notification = require("../model/Notification");
const moment = require("moment");
const Review = require("../model/Review");

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

    const { _id, ...other } = create_post;

    const Datas = {
      Post_id: _id,
    };
    await Notification.create(Datas);
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

const Get_Employer_Specfic_Jobs = async (req, res, next) => {
  const Id = new mongoose.Types.ObjectId(req.id);
  try {
    const data = [
      {
        $match: {
          User_id: Id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "User_id",
          foreignField: "_id",
          as: "users_data",
        },
      },
      {
        $unwind: {
          path: "$users_data",
        },
      },
      {
        $addFields: {
          total_applicants: {
            $size: "$applied_For_Jobs",
          },
        },
      },
    ];
    const cat = await Post.aggregate(data);
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

const Get_all_jobs = async (req, res, next) => {
  console.log(req.id);
  try {
    const allFreelancer = await User.findOne({ _id: req.id });
    const allJobs = await Post.find({status : 'Waiting Applicant'}).select("-applied_For_Jobs");
    res.status(200).send({
      message: `${allFreelancer.email.split("@").slice(0, 1)} has fetched ${
        allJobs.length
      } Jobs`,
      data: { allFreelancer, allJobs },
    });
  } catch (err) {}
};

const Applied_For_Job = async (req, res, next) => {
  const Id = req.params.id;

  try {
    const applied = await Post.updateOne(
      {
        _id: Id,
      },
      {
        $addToSet: { applied_For_Jobs: new mongoose.Types.ObjectId(req.id) },
      },
      {
        new: true,
      }
    );

    res.status(204).send({
      message: "You have applied for this Job",
      data: applied,
    });
  } catch (err) {}
};

const Get_one_Post = async (req, res, next) => {
  const postId = req.params.id;
  try {
    

    const data = [
      {
        '$match': {
          '_id': new mongoose.Types.ObjectId(postId)
        }
      }, {
        '$lookup': {
          'from': 'users', 
          'localField': 'applied_For_Jobs', 
          'foreignField': '_id', 
          'as': 'candidates'
        }
      }, {
        '$lookup': {
          'from': 'reviews', 
          'localField': 'candidates._id', 
          'foreignField': 'rate_on_User_id', 
          'as': 'user_reviews'
        }
      }, {
        '$addFields': {
          'filtered_value': {
            $map: {
              input: { $range: [0, { $size: "$candidates" }] },
              as: "index",
              in: {
                  _id: { $arrayElemAt: ["$candidates._id", "$$index"] },
                  name: { $arrayElemAt: ["$candidates.name", "$$index"] },
                  user_image: { $arrayElemAt: ["$candidates.user_image", "$$index"] },
                  review: { $arrayElemAt: ["$user_reviews.rating", "$$index"] },
       
              },
          },
          }
        },
        
      },{
        $addFields: {
          average_rating: { $avg: "$filtered_value.review" }
        }
      }
    ]
    const result = await Post.aggregate(data)
    
    res.status(200).send({ message: "Post Data Fetched", data: result });
  } catch (err) {
    res.status(500).send({ message: "Post Not Fetched" });
  }
};

const Assiging_Job = async (req,res,next) => {
  const id = req.params.id;
try{
 const assigned = await Post.updateOne(
    {_id : id},
    { $set : {
      User_id : req.id,
      _id : id ,
      status : "In Progress"
    }},
    {new : true}
  )

  res.status(200).send({ 
    message :"Job Successfully assigned" , 
    data : assigned
  })
}catch(err){
  res.status(404).send({ 
    message :"Job not assigned"
  })
}
}
module.exports = {
  Create_a_Job,
  Get_Employer_Specfic_Jobs,
  Get_all_jobs,
  Applied_For_Job,
  Get_one_Post,
  Assiging_Job
};
