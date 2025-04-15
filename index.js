import express from "express";
import cors from "cors";
import mongodbConnection from "./src/configs/dbconfig.js";
import movies from "./src/models/movies.js";

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

const connectDb = async () => {
  await mongodbConnection(process.env.DATABASE_URI, process.env.DATABASE_NAME);
  console.log('Connection complete.');
};

connectDb();

app.get('/api/users', async (req, res) => {
  try {
    const results = await movies.find();
    console.log(results.length,'results')
    res.json(results);
  } catch (error) {
    console.log(error)
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})