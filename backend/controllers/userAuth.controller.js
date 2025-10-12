import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Create account
export const CreateAccount = async (req, res) => {
  const { name, email, password, role, mobile } = req.body;
  if (!name || !email || !password || !role || !mobile) {
    return res.json({ success: false, message: "Fill all details" });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.json({ success: false, message: "User Already Exists" });
    if (mobile.length != 10) return res.json({ success: false, message: "Mobile number should be 10 digits" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword, role, mobile });
    const newUser = await user.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // FIXED COOKIE FOR PRODUCTION
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // HTTPS required
      sameSite: "none", // cross-domain
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({ success: true, message: "Account created successfully", user: newUser });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.json({ success: false, message: "Missing details" });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User does not exist" });

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) return res.json({ success: false, message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

    // FIXED COOKIE FOR PRODUCTION
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "Login successful", user });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
    });
    return res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};
