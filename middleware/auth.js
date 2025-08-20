// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../src/models/user.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Accept token in Authorization header: "Bearer TOKEN"
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "Not authorized, token missing" });
    }

    // verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user (without password)
    const user = await User.findById(decoded.id).select("-password").populate("role");
    if (!user) return res.status(401).json({ error: "Not authorized, user not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Not authorized, token invalid or expired" });
  }
};
