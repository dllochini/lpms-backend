import express from "express";
import cors from "cors";
import mongodbConnection from "./src/configs/dbconfig.js";
import userController from "./src/routes/user.js";

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

app.use(cors(corsOptions));
app.use(express.json())

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

app.use('/api/users',userController)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})