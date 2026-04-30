const express = require("express");
const router  = express.Router();

const {
  register,
  login,
  getProfile,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public
router.post("/register", register);
router.post("/login",    login);

// Protected
router.get("/me", protect, getProfile);

// Admin only
router.get("/",        protect, adminOnly, getAllUsers);
router.delete("/:id",  protect, adminOnly, deleteUser);

module.exports = router;
