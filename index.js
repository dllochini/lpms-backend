import express from "express";
import cors from "cors";
import mongodbConnection from "./src/configs/dbconfig.js";
import userRouter from "./src/routes/user.js";
import landRouter from "./src/routes/land.js";
import roleRouter from "./src/routes/role.js";

//Initializes the Express app
const app = express()
const port = process.env.PORT || 3000;

//Only allows requests from the specified frontend origin
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

// Parses incoming JSON request bodies
app.use(express.json());

//Connect to MongoDB
const connectDb = async () => {
  await mongodbConnection(process.env.DATABASE_URI, process.env.DATABASE_NAME);
  console.log('Connection complete.');
};

connectDb();

//routing
app.use('/api/users',userRouter)
app.use('/api/lands',landRouter)
app.use('/api/roles',roleRouter)

//server starts
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})