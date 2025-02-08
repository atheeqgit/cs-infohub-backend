import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/authRoutes.js";
import departmentRoute from "./routes/departmentRoutes.js";
import eventRoute from "./routes/eventsRoutes.js";
import facultyRoute from "./routes/facultyRoutes.js";
import infrastructureRoute from "./routes/infrastructureRoutes.js";
import careerRoute from "./routes/careerRoutes.js";
import aboutRoute from "./routes/aboutRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/department", departmentRoute);
app.use("/api/events", eventRoute);
app.use("/api/faculty", facultyRoute);
app.use("/api/infrastructure", infrastructureRoute);
app.use("/api/career", careerRoute);
app.use("/api/about", aboutRoute);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("DB is connected ,listening on port " + PORT);
    });
  })
  .catch((err) => {
    console.log("==========  db is not connected =================" + err);
  });
