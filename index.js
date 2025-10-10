// app.js
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
import divisionRouter from "./src/routes/divison.js";
import fieldOfficerDashboardRouter from "./src/routes/fieldOfficerDashboard.js";
import { protect } from "./middleware/auth.js";
import implementRouter from "./src/routes/implement.js";
import higherManagerDashboardRouter from "./src/routes/higherManagerDashboard.js";



const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // allow requests from tools/postman (no origin) and allowed origins
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect DB
const connectDb = async () => {
  await mongodbConnection(process.env.DATABASE_URI, process.env.DATABASE_NAME);
  console.log("Connection complete.");
};
connectDb();

// PUBLIC routes (no auth)
app.use("/api/auth", LoginRouter); // login, forgot-password, reset-password

// Protect all subsequent /api routes
app.use("/api", protect);

// PROTECTED routes (these will be checked by `protect`)
app.use("/api/users", userRouter);
app.use("/api/lands", landRouter);
app.use("/api/roles", roleRouter);
app.use("/api/divisions", divisionRouter);
app.use("/api/unit", unitRouter);
app.use("/api/operation", operationRouter);
app.use("/api/resource", resourceRouter);
app.use("/api/workDone", workDoneRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/implements", implementRouter);
app.use("/api/fieldOfficer", fieldOfficerDashboardRouter);
app.use("/api/higherManager", higherManagerDashboardRouter);

// start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
