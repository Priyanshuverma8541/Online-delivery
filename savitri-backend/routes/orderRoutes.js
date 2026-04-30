const express = require("express");
const router  = express.Router();

const {
  getUserOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Protected – specific user's orders
router.get("/user/:userId", protect, getUserOrders);
router.get("/:id",          protect, getOrder);

// Admin only
router.get("/",        protect, adminOnly, getAllOrders);
router.patch("/:id",   protect, adminOnly, updateOrderStatus);

module.exports = router;
