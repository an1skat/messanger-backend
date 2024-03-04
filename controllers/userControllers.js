import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import UserModel from "../models/User.js";

dotenv.config();

export const register = async (req, res) => {
  try {
    const existingUser = await UserModel.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    const pass = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pass, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      username: req.body.username,
      password: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "30d",
      }
    );

    const { password, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to register" });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.password
    );

    if (!isValidPass) {
      return res.status(400).json({
        message: "Invalid password or email",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "30d",
      }
    );

    const { password, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login" });
  }
};
