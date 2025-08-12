// import express from "express";
// import cors from "cors";
// import mongodbConnection from "./src/configs/dbconfig.js";
// import movies from "./src/models/movies.js";

// const app = express()
// const port = process.env.PORT || 3000;


// const allowedOrigins = [process.env.FRONTEND_URL];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };

// app.use(cors(corsOptions));

// const connectDb = async () => {
//   await mongodbConnection(process.env.DATABASE_URI, process.env.DATABASE_NAME);
//   console.log('Connection complete.');
// };

// connectDb();

// app.get('/api/users', async (req, res) => {
//   try {
//     const results = await movies.find().limit(10);
//     console.log(results.length,'results')
//     res.json(results);
//   } catch (error) {
//     console.log(error)
//   }
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })


import express from "express";
import cors from "cors";
import mongodbConnection from "./src/configs/dbconfig.js";
import LoginRouter from "./src/routes/login.js"; 
import userRouter from "./src/routes/user.js";
import landRouter from "./src/routes/land.js";
import roleRouter from "./src/routes/role.js";
import unitRouter from "./src/routes/unit.js";

//Initializes the Express app
const app = express()
const port = process.env.PORT || 3000;

const allowedOrigins = [process.env.FRONTEND_URL];

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
app.use(express.json())

// Parses incoming JSON request bodies
app.use(express.json());

//Connect to MongoDB
const connectDb = async () => {
  await mongodbConnection(process.env.DATABASE_URI, process.env.DATABASE_NAME);
  console.log('Connection complete.');
};

connectDb();

// app.get('/api/users', async (req, res) => {
//   try {
//     const results = await User.find();
//     console.log(results.length,'results')
//     res.json(results);
//   } catch (error) {
//     console.log(error)
//   }
// });

//app.use('/api/users',userController) 
//routing
app.use('/api/login',LoginRouter)
app.use('/api/users',userRouter) 
app.use('/api/lands',landRouter) 
app.use('/api/roles',roleRouter) 
app.use('/api/roles',unitRouter) 

//server starts
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})