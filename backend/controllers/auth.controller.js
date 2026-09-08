import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/token.js";

export const Signup = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;
    if (!firstName || !lastName || !userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let exitEmail = await User.findOne({ email });
    if (exitEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    let existUserName = await User.findOne({ userName });
    if (existUserName) {
      return res.status(400).json({ message: "Username already exists" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    let newUser = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
    });
    let token = await generateToken(newUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not exist" });
    }

    let matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    let token = await generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(201).json({ message: "User login successfully", user: user });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Failed to login user" });
  }
};
