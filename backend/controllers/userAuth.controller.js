import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const CreateAccount = async (req, res) => {
  const { name, email, password, role, mobile } = req.body;
  if (!name || !email || !password || !role || !mobile) {
    return res.json({ success: false, message: "Fill all details" });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User Already Exists" });
    }
    if (mobile.length != 10) {
      return res.json({
        success: false,
        message: "mobile number should be 10 digits.",
      });
    }
    //bcrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
     const user = new userModel({
      name,
      email,
      password: hashedPassword,
      role,
      mobile,
    });
    const newUser = await user.save();

    //generate token
    const token = jwt.sign({ id: newUser._id,role: newUser.role }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    //send or add token to user
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "Your Account is Succesfully created",
      user: newUser,
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "missing details" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Does Not exists" });
    }

    const chekPassword = await bcrypt.compare(password, user.password);

    if (email === user.email && chekPassword) {
      //generate token
      const token = jwt.sign({ id: user._id,role: user.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // only HTTPS
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({
        success: true,
        message: "successfully logged in",
        user: user,
      });
    } else {
      return res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/",
    });
    return res.json({ success: true, message: "succesfully Logged out" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};


