import jwt from "jsonwebtoken";
import {
  loginUser,
  generateResetToken,
  resetPassword,
} from "../repositories/auth.js";

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role?.name || user.role }, // payload
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
  );
};

export const login = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    const user = await loginUser(email, password); // returns user object without password

    // Sign JWT
    const token = signToken(user);
    // console.log(user);
    // console.log("token:", token);
    // Send token + role
    res.status(200).json({
      message: "Login successful",
      loggedUserId: user._id,
      role: user.role?.name || user.role,
      name: user.fullName,
      token,
    });
    // console.log("Login successful",user.fullName);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

//forgot password
export const forgotPassword = async (req, res) => {
  try {
    console.log("in method",req.body);
    const objData = req.body;
    console.log("in controller", objData);

    const result = await generateResetToken(objData);
    console.log("result", result);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//reset password
export const resetPasswordController = async (req, res) => {
  try {
    // console.log(req.body); //
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Reset token is required" });
    }
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    const result = await resetPassword(token, password);
    res.status(200).json(result);
  } catch (error) {
    // Prefer returning the error message (but avoid leaking internal details)
    res.status(400).json({ error: error.message || "Reset failed" });
  }
};

export default {
  login,
  resetPasswordController,
  forgotPassword,
};
