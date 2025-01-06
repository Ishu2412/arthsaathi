import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import env from "dotenv";

import __dirname from "./utils/path.js";
import authRoutes from "./routes/authentication.js";
import userRoutes from "./routes/user.js";

const app = express();
env.config();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(authRoutes);
app.use(userRoutes);

mongoose
  .connect(
    `mongodb+srv://ishu:${process.env.MONGO_KEY}@cluster0.bbugwp2.mongodb.net/?retryWrites=true&w=majority`
  )
  .then((result) => {
    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log("Connected to Database");
    });
  });
