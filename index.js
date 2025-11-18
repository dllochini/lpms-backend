import express from "express";
import cors from "cors";
import "dotenv/config";
import mongodbConnection from "./src/configs/dbconfig.js";
import { protect } from "./middleware/auth.js";

import LoginRouter from "./src/routes/auth.js";
import userRouter from "./src/routes/user.js";
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

app.get('/', (req, res) => res.send('Hello from lpms-backend!'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 3000;

const allowedOrigins = [
  "https://lpms-frontend.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};


app.use("/uploads", express.static("./uploads"));

app.use(cors(corsOptions));
app.use(express.json());

const connectDb = async () => {
  await mongodbConnection(process.env.DATABASE_URI, process.env.DATABASE_NAME);
  // console.log("Connection complete.");
};
connectDb();

app.use("/api/auth", LoginRouter);

app.use("/api", protect);

app.use("/api/users", userRouter);
app.use("/api/roles", roleRouter);
app.use("/api/divisions", divisionRouter);
app.use("/api/unit", unitRouter);
app.use("/api/operation", operationRouter);
app.use("/api/resource", resourceRouter);
app.use("/api/workdone", workDoneRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/fieldOfficer", fieldOfficerDashboardRouter);
app.use("/api/higherManager", higherManagerDashboardRouter);
app.use("/api/manager", managerDashboardRouter);
app.use("/api/process", processRouter);
app.use("/api/createUserLand", createUserLandRoutes);
app.use("/api/lands", landRoutes);
app.use("/api/bill", billRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
