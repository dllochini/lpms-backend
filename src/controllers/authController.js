// import { resetPassword } from "../repositories/auth.js";
import {
  loginUser,
  generateResetToken,
  resetPassword,
} from "../repositories/auth.js";

//login
export const login = async (req, res) => {
  // console.log("Login request body:", req.body);
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);
    // console.log("Login request body:", req.body);

    // Here you could generate a JWT if needed
    res.status(200).json({
      message: "Login successful",
      role: user.role.name,
    });
    // console.log("Login ok:", user.role.name);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

//forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(req.body); //

    const result = await generateResetToken(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//reset password
export const resetPasswordController = async (req, res) => {
  // console.log("call reached controller")
  try {
    const { token, password } = req.body;
    // console.log("User:", token, password);
    const result = await resetPassword(token, password);
    // console.log("Reset result:", result);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  login,
  resetPasswordController,
  forgotPassword,
};
