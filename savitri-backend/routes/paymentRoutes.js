const express = require("express");
const router  = express.Router();

const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  initiateQrPayment,
  confirmQrPayment,
  getMyOrders,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

// Razorpay
router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify",       protect, verifyRazorpayPayment);

// QR / UPI
router.post("/qr/initiate",  protect, initiateQrPayment);
router.post("/qr/confirm",   protect, confirmQrPayment);

// Order history
router.get("/my-orders",     protect, getMyOrders);

module.exports = router;
