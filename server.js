const express = require("express");
const path = require('path');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const databaseConnection = require('./database/databaseConnection')

// app routes start here
const UserRouter = require('./router/Users')
const CategoryRouter = require('./router/Category')
const PostRouter = require('./router/Posts')
const NotificationRouter = require('./router/Notification');
const PaymentRouter = require('./router/Payment')
const ReviewRouter = require('./router/Review')
// const ReportsRouter = require('./router/Report')
// const GoalsRouter = require('./router/Goals')
// const Save_Types = require('./router/Save_Types')
// app routes end here

app.use(express.static(path.join(__dirname + '/public')));
app.use(express.json());
app.use(cors());

// app routes use here
app.use("/UserAPI/", UserRouter);
app.use("/CategoryAPI/", CategoryRouter);
app.use("/PostAPI/", PostRouter);
app.use("/NotificationAPI/", NotificationRouter);
app.use("/PaymentAPI/", PaymentRouter);
app.use("/ReviewAPI/", ReviewRouter);
// app.use("/ReportAPI/", ReportsRouter);
// app.use("/GoalAPI/", GoalsRouter);
// app.use("/Save_TypesAPI/", Save_Types);

// routes end here

dotenv.config();

const port = process.env.PORT;

// database connection start here
databaseConnection()
// database connection end here


app.listen(port, () => {
  console.log(`Server is running on ${port} Port`);
});