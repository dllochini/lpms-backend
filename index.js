import express from "express";
import cors from "cors";
import mongodbConnection from "./src/configs/dbconfig.js";
import LoginRouter from "./src/routes/auth.js"; 
import userRouter from "./src/routes/user.js";
import landRouter from "./src/routes/land.js";
import roleRouter from "./src/routes/role.js";
import unitRouter from "./src/routes/unit.js";
import operationRouter from "./src/routes/operation.js";
import resourceRouter from "./src/routes/resource.js";  
import workDoneRouter from "./src/routes/workDone.js";
import taskRouter from "./src/routes/task.js";

//Initializes the Express app
const app = express()
const port = process.env.PORT || 3000;

//const allowedOrigins = [process.env.FRONTEND_URL];
const allowedOrigins = [
  "http://localhost:5173",      // your frontend dev server
  "http://localhost:3000",      // if you run frontend on 3000 too
 // "https://your-frontend.com"   // your production frontend domain
];


const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

//Applies the CORS options.
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connect to MongoDB
const connectDb = async () => {
  await mongodbConnection(process.env.DATABASE_URI, process.env.DATABASE_NAME);
  console.log('Connection complete.');
};

connectDb();

//app.use('/api/users',userController) 
//routing
app.use('/api/auth',LoginRouter)
app.use('/api/users',userRouter) 
app.use('/api/lands',landRouter) 
app.use('/api/roles',roleRouter) 
app.use('/api/unit',unitRouter) 
app.use('/api/operation',operationRouter)
app.use('/api/resource',resourceRouter)
app.use("/api/workDone", workDoneRouter);
app.use('/api/tasks',taskRouter) 

//server starts
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})