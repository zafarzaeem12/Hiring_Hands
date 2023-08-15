const Post = require("../model/Posts");
const mongoose = require("mongoose");
const User = require("../model/Users");
const Notification = require("../model/Notification");
const moment = require("moment");
const cron = require("node-cron");
const Review = require("../model/Review");
const io = require("socket.io")();
const Create_a_Jobs = async (object,callback) => {
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

    const Data = {
      title: object.title,
      description: object.description,
      charges: object.charges,
      User_id: object._id,
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
    io.emit('get_all_jobss',  create_post );
    //callback(create_post)
    // res.status(200).send({
    //   message: "Job Created Successfully",
    //   data: create_post,
    // });
  } catch (err) {
    // res.status(500).send({
    //   message: "Job not Created",
    // });
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
      message: "Get all jobs related to Employer ",
      data: cat,
    });
  } catch (err) {
    res.status(404).send({
      message: "No job found",
    });
  }
};

const Get_all_jobs = async (req, res, next) => {
  try {
    const allFreelancer = await User.findOne({ _id: req.id });
    const allJobs = await Post.find( {$or : [{ status: "Waiting Applicant"  },{is_Post_Deleted : false}]} ).select(
      "-applied_For_Jobs"
    );
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
        $match: {
          _id: new mongoose.Types.ObjectId(postId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "applied_For_Jobs",
          foreignField: "_id",
          as: "candidates",
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "candidates._id",
          foreignField: "rate_on_User_id",
          as: "user_reviews",
        },
      },
      {
        $addFields: {
          filtered_value: {
            $map: {
              input: { $range: [0, { $size: "$candidates" }] },
              as: "index",
              in: {
                _id: { $arrayElemAt: ["$candidates._id", "$$index"] },
                name: { $arrayElemAt: ["$candidates.name", "$$index"] },
                user_image: {
                  $arrayElemAt: ["$candidates.user_image", "$$index"],
                },
                review: { $arrayElemAt: ["$user_reviews.rating", "$$index"] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          average_rating: { $avg: "$filtered_value.review" },
        },
      },
    ];
    const result = await Post.aggregate(data);

    res.status(200).send({ message: "Post Data Fetched", data: result });
  } catch (err) {
    res.status(500).send({ message: "Post Not Fetched" });
  }
};

const Job_Details_For_Freelancer = async (req, res, next) => {
  const postid = req.params.id;
  try {
    const Post_Details = await Post.findById(postid);
    res.status(200).send({ data: Post_Details });
  } catch (err) {
    res.status(404).send({ message: "No Post Found" });
  }
};

const Assiging_Job = async (req, res, next) => {
  const Postid = req.params.id;
  try {
    const assigned = await Post.updateOne(
      { _id: Postid },
      {
        $set: {
          client_start_time :  moment().format('YYYY-MM-DDThh:mm A'),
          Freelancer_User_id: req.body.Freelancer_User_id,
          _id: Postid,
          status: "In Progress",
        },
      },
      { new: true }
    );
    
    const { acknowledged , modifiedCount}  = assigned

    if(acknowledged  === true && modifiedCount === 1) {
      const assigned_Freelancer = 
      await Post.findOne({ 
        Freelancer_User_id : req.body.Freelancer_User_id 
       }).select("title description start_time end_time charges location Freelancer_User_id")
  
      const Data = {
        Post_id : assigned_Freelancer._id,
        title  : assigned_Freelancer.title,
        description :  assigned_Freelancer.description,
        start_time : assigned_Freelancer.start_time,
        end_time : assigned_Freelancer.end_time,
        charges : assigned_Freelancer.charges,
        User_id :assigned_Freelancer.User_id,
        Freelancer_User_id :assigned_Freelancer.Freelancer_User_id
      }
      await Notification.create(Data)
      
  
      res.status(200).send({
        message: "Job Successfully assigned",
        data: assigned_Freelancer,
      });
    }

  } catch (err) {
    res.status(404).send({
      message: "Job not assigned",
    });
  }
};

const Freelancer_Get_Jobs = async (req,res,next) => {
  const user_id = req.id
  console.log(user_id)
  try{
    const setted = await Post.find({Freelancer_User_id : user_id });
    res
    .status(200)
    .send({ 
      message : `you have ${setted.length} jobs assigned` , 
      data :setted
    })
  }catch(err){
   res.status(404).send({
    message : "No job assigned"
   })
  }
}

const Accepting_Job = async (req,res,next) => {
  const post_id = req.params.id
  console.log(post_id)
try{

  const accepted = await Post.updateOne(
    { _id: post_id },
    {
      $set: {
        freelancer_job_accepted : req.body.freelancer_job_accepted
      },
    },
    { new: true }
  );
  const { acknowledged , modifiedCount}  = accepted

  if(acknowledged === true && modifiedCount === 1){

    const data_accepted = await Post.updateOne(
      { _id: post_id },
      {
        $set: {
          Freelancer_User_id: req.body.Freelancer_User_id,
          freelancer_start_time :  moment().format('YYYY-MM-DDThh:mm A'),
          _id: post_id,
          status: "In Progress",
        },
      },
      { new: true }
    );
    
    const { acknowledged , modifiedCount}  = data_accepted
    if(acknowledged === true && modifiedCount === 1){
      res.status(200).send({ message : "Freelancer Job Accepted and start working" })
    }
  }

}catch(err){
console.log(err)
}
}

const Finishing_Job = async (req,res,next) => {
  const post_id = req.params.id
  try{
    await Post.updateOne(
      {_id : post_id},
      { $set:{
        Freelancer_User_id: req.body.Freelancer_User_id,
        freelancer_end_time :  moment().format('YYYY-MM-DDThh:mm A'),
        _id: post_id,
      }},
      {new : true}
    )

   let assigned_Freelancer = await Post.findOne({ 
      Freelancer_User_id : req.body.Freelancer_User_id 
     }).select("title description start_time end_time charges location Freelancer_User_id")

    const Data = {
      message : "Freelancer Finsish this Job",
      Post_id : assigned_Freelancer._id,
      title  : assigned_Freelancer.title,
      description :  assigned_Freelancer.description,
      start_time : assigned_Freelancer.start_time,
      end_time : assigned_Freelancer.end_time,
      charges : assigned_Freelancer.charges,
      User_id :assigned_Freelancer.User_id,
      Freelancer_User_id :assigned_Freelancer.Freelancer_User_id
    }
    await Notification.create(Data)

    res.status(200).send({ message : `Freelancer Finsish this Job`})
  }catch(err){
    console.log(err)
  }
}

const Is_Job_Completed = async (req, res, next) => {
  const postid = req.params.id;
  console.log(postid)
  try {
    const jobDone = await Post.updateOne(
      { _id: postid },
      {
        $set: {
          Freelancer_User_id: req.body.Freelancer_User_id,
          _id: postid,
          status: "Complete",
          client_end_time :  moment().format('YYYY-MM-DDThh:mm A'),
        },
      },
      { new: true }
    );
    const freelancer_Details = await Post.findOne({
      status: "Complete",
    }).populate({
      path: "Freelancer_User_id",
      select: "user_image name",
    });

   

    const {freelancer_start_time  , freelancer_end_time} = freelancer_Details
    const endDates = new Date (freelancer_end_time)
    const startDates = new Date (freelancer_start_time)
    const u = endDates - startDates
    const job_total_hours = (u / (1000 * 60 * 60)).toFixed(2)
      
    const TotalAmount = job_total_hours * Number(freelancer_Details.charges);

    const totalamount = await Post.updateOne(
      { _id: postid },
      { $set: { 
        total_amount: TotalAmount } },
      { new: true }
    );

    let assigned_Freelancer = await Post.findOne({ 
      Freelancer_User_id : req.body.Freelancer_User_id 
     }).select("title description start_time end_time charges location Freelancer_User_id")

    const Data = {
      message : `${assigned_Freelancer.title} Job Completed`,
      Post_id : assigned_Freelancer._id,
      title  : assigned_Freelancer.title,
      description :  assigned_Freelancer.description,
      start_time : assigned_Freelancer.start_time,
      end_time : assigned_Freelancer.end_time,
      charges : assigned_Freelancer.charges,
      User_id :assigned_Freelancer.User_id,
      Freelancer_User_id :assigned_Freelancer.Freelancer_User_id
    }
    await Notification.create(Data)

    const letsmy = await Promise.all([
      jobDone,
      totalamount,
      freelancer_Details,
    ]);
    const [Done, total, freelancer] = letsmy;
    res
      .status(200)
      .send({ message: "Job Completed Successfully", data: freelancer });
  } catch (err) {
    res.status(404).send({ message: "Job not Completed" });
  }
};

const Freelancer_Projects_In_Progree = async (req, res, next) => {
  try {
    const status_Checked = await Post.find({ Freelancer_User_id: req.id });
    res.status(200).send({
      message: `You have ${status_Checked.length} Jobs assigned in Progress`,
      data: status_Checked,
    });
  } catch (err) {
    res.status(404).send({
      message: `You have no Jobs`,
    });
  }
};

const Job_Post_Soft_Deleted = async (req,res,next) => {
try{
  const soft_Deleted = await Post.find();

 return soft_Deleted.filter(async(data) => {

    const corr_time = new Date()
    const current_date  = moment(corr_time).format('YYYY-MM-DDThh:mm A')
 
    if(current_date > data.end_time){
      console.log('=============Soft Deleted=======>')
      return uiop =  await Post.updateMany(
        {_id : data.id},
        { $set : { is_Post_Deleted : true  }},
        { new : true }
      )
 
    }
    
    return data
  
  })

}catch(err){
  console.log(err)
}
}

const Current_Jobs_And_Previous_Jobs_Cron_Job = async (req, res, next) => {
  try {
    const data = await Post.find();

    return data.filter((item) => {
      if (
        item.status === 'Complete'
      ) {
        console.log("=======Previously=========>");
        return data;
      }

       else if (
        item.status === 'In Progress' ||
        item.status === 'Waiting Applicant'

        ){
          console.log("=======Currently=========>")
          return data
        }
        else{
          console.log('object')
        }
    });
  } catch (err) {}
};



// const task = cron.schedule(
//   "* * * * *",
//   async () => {
//   await Current_Jobs_And_Previous_Jobs_Cron_Job();
//     await Job_Post_Soft_Deleted()
//     console.log(
//       "Current_Jobs_And_Previous_Jobs_Cron_Job()",
//     await Current_Jobs_And_Previous_Jobs_Cron_Job(),
//       await Job_Post_Soft_Deleted()
//     );
//   },
//   {
//     scheduled: false, // This will prevent the immediate execution of the task
//   }
// );
// task.start();


module.exports = {
  Create_a_Jobs,
  Get_Employer_Specfic_Jobs,
  Get_all_jobs,
  Applied_For_Job,
  Get_one_Post,
  Assiging_Job,
  Freelancer_Get_Jobs,
  Accepting_Job,
  Finishing_Job,
  Is_Job_Completed,
  Job_Details_For_Freelancer,
  Freelancer_Projects_In_Progree,
};
