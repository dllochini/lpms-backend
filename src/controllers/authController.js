import { loginUser, resetPassword } from '../repositories/auth.js';

/**
 * POST /login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);

    // Here you could generate a JWT if needed
    res.status(200).json({
      message: "Login successful",
      user
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

/**
 * POST /reset-password
 */
export const passwordReset = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    await resetPassword(email, newPassword);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export default {
  login,
  passwordReset
};
