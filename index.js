import express, { urlencoded } from "express";
import connectDB from "./db/connection.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import savedRoute from "./routes/saved.route.js";
import notificationRoute from "./routes/notification.route.js";
import pushNotificationRoute from "./routes/pushNotification.route.js";
// import firebaseNotificationRoute from "./routes/firebase.route.js";

dotenv.config();
// connect db
connectDB();
const PORT = process.env.PORT || 8080;
const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};

// middleware
app.use(cors(corsOptions));
app.set("trust proxy", 1);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieParser());

// api's route
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/saved", savedRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/pushNotification", pushNotificationRoute);
// app.use("/api/v1/firebaseNotification", firebaseNotificationRoute);

app.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});
