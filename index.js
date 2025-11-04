// app.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import mongodbConnection from "./src/configs/dbconfig.js";
import { protect } from "./middleware/auth.js";

import LoginRouter from "./src/routes/auth.js";
import userRouter from "./src/routes/user.js";
// import landRouter from "./src/routes/land.js";
import roleRouter from "./src/routes/role.js";
import unitRouter from "./src/routes/unit.js";
import operationRouter from "./src/routes/operation.js";
import resourceRouter from "./src/routes/resource.js";
import workDoneRouter from "./src/routes/workDone.js";
import taskRouter from "./src/routes/task.js";
import divisionRouter from "./src/routes/division.js";
import processRouter from "./src/routes/process.js";
import billRouter from "./src/routes/bill.js";

import fieldOfficerDashboardRouter from "./src/routes/fieldOfficerDashboard.js";
import higherManagerDashboardRouter from "./src/routes/higherManagerDashboard.js";
import managerDashboardRouter from "./src/routes/managerDashboard.js";
import createUserLandRoutes from "./src/routes/createUserLandRoutes.js";
import landRoutes from "./src/routes/landRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
  'https://lpms-frontend-p2vwebnuf-lochini-dikkumburas-projects.vercel.app',
  process.env.FRONTEND_URL,
  'http://localhost:3000',    // local dev, remove if not needed
  'http://localhost:5173',     // vite default (optional)

].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};


//set the upload folder as static
app.use("/uploads", express.static("./uploads"));

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
// app.use("/api/lands", landRouter);
app.use("/api/roles", roleRouter);
app.use("/api/divisions", divisionRouter);
app.use("/api/unit", unitRouter);
app.use("/api/operation", operationRouter);
app.use("/api/resource", resourceRouter);
app.use("/api/workdone", workDoneRouter);
app.use("/api/tasks", taskRouter);
// app.use("/api/implements", implementRouter);
app.use("/api/fieldOfficer", fieldOfficerDashboardRouter);
app.use("/api/higherManager", higherManagerDashboardRouter);
app.use("/api/manager", managerDashboardRouter);
// app.use("/api/createUserLand", landRouter);
app.use("/api/process", processRouter);
app.use("/api/createUserLand", createUserLandRoutes);
app.use("/api/lands", landRoutes);

app.use("/api/bill", billRouter);

// start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
