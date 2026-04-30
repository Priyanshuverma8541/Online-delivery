const jwt  = require("jsonwebtoken");
const User = require("../models/User");

/**
 * protect – verifies the Bearer JWT and attaches req.user.
 * All protected routes must use this middleware.
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

/**
 * adminOnly – must be used AFTER protect.
 * Rejects requests from non-admin users.
 */
const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  res.status(403).json({ success: false, message: "Admin access only" });
};

module.exports = { protect, adminOnly };
