const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");

// ─── Helper ──────────────────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// ─── REGISTER ────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { fullName, userId, email, password } = req.body;

    if (!fullName || !userId || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { userId: userId.toLowerCase() }],
    });

    if (existing) {
      return res.status(400).json({ success: false, message: "Email or User ID already exists" });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({
      fullName,
      userId:   userId.toLowerCase(),
      email:    email.toLowerCase(),
      password: hashed,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token: generateToken(user._id),
      user: {
        id:       user._id,
        fullName: user.fullName,
        userId:   user.userId,
        email:    user.email,
        role:     user.role,
      },
    });
  } catch (err) {
    console.error("REGISTER:", err.message);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
// Frontend sends { identifier, password } – identifier can be userId OR email
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: "Identifier and password are required" });
    }

    const id = identifier.toLowerCase();

    const user = await User.findOne({
      $or: [{ userId: id }, { email: id }],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id:       user._id,
        fullName: user.fullName,
        userId:   user.userId,
        email:    user.email,
        role:     user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN:", err.message);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};

// ─── GET PROFILE ─────────────────────────────────────────────────────────────
const getProfile = (req, res) => {
  const { _id, fullName, userId, email, role } = req.user;
  res.json({ success: true, user: { id: _id, fullName, userId, email, role } });
};

// ─── GET ALL USERS (Admin) ───────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// ─── DELETE USER (Admin) ─────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

module.exports = { register, login, getProfile, getAllUsers, deleteUser };
