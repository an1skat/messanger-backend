import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { registerValidation, loginValidation } from "./validations.js";
import * as userController from "./controllers/userControllers.js";
import handleValidationsErrors from "./utils/handleValidationsErrors.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header("Access-Control-Allow-Credentials", "COntent-Type, Authorization");
  next();
});

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
    console.log("DB error");
  });

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
})

app.post(
    "/register",
    registerValidation,
    handleValidationsErrors,
    userController.register
)
app.post(
    "/login",
    loginValidation,
    handleValidationsErrors,
    userController.login
)