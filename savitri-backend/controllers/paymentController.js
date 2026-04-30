const crypto   = require("crypto");
const Razorpay = require("razorpay");
const Order    = require("../models/Order");
const Cart     = require("../models/Cart");

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ─────────────────────────────────────────────────────────────────────────────
// RAZORPAY: Create order
// ─────────────────────────────────────────────────────────────────────────────
const createRazorpayOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    const userId = req.user._id;

    if (!items?.length || !totalAmount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Create Razorpay order
    const rpOrder = await razorpay.orders.create({
      amount:   Math.round(totalAmount * 100), // paise
      currency: "INR",
      receipt:  `rcpt_${Date.now()}`,
    });

    // Persist order in DB with pending status
    const order = await Order.create({
      user:          userId,
      items,
      totalAmount,
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      paymentInfo:   { razorpay_order_id: rpOrder.id },
      shippingAddress,
    });

    res.status(201).json({ success: true, rpOrder, order });
  } catch (err) {
    console.error("CREATE RAZORPAY ORDER:", err.message);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// RAZORPAY: Verify payment signature
// ─────────────────────────────────────────────────────────────────────────────
const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "paid",
        status:        "processing",
        paymentInfo: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Clear the user's cart after successful payment
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });

    // Emit real-time update
    const io = req.app.get("io");
    io?.to(String(order.user)).emit("orderUpdated", order);

    // ── Salesforce hook ──────────────────────────────────────────────────────
    // When you're ready to integrate, call salesforceService.createOrder(order)
    // here. The order model already has a `salesforceOrderId` field reserved.
    // ────────────────────────────────────────────────────────────────────────

    res.json({ success: true, order });
  } catch (err) {
    console.error("VERIFY PAYMENT:", err.message);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// QR PAYMENT: Initiate
// Flow: frontend shows a static/dynamic UPI QR → user pays → calls /qr/confirm
// ─────────────────────────────────────────────────────────────────────────────
const initiateQrPayment = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    const userId = req.user._id;

    if (!items?.length || !totalAmount) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Generate a unique reference for this QR transaction
    const qrRef = `QR_${Date.now()}_${userId}`;

    const order = await Order.create({
      user:          userId,
      items,
      totalAmount,
      paymentMethod: "qr",
      paymentStatus: "pending",
      qrPaymentRef:  qrRef,
      shippingAddress,
    });

    // Return the QR reference and your UPI ID / static QR URL.
    // You can swap this with a dynamic QR from a payment provider later.
    res.status(201).json({
      success: true,
      order,
      qr: {
        ref:    qrRef,
        upiId:  process.env.UPI_ID || "savitrijewellers@upi",  // add UPI_ID to .env
        amount: totalAmount,
        // deepLink lets the frontend generate a QR code image
        deepLink: `upi://pay?pa=${process.env.UPI_ID || "savitrijewellers@upi"}&pn=SavitriJewellers&am=${totalAmount}&tn=${qrRef}&cu=INR`,
      },
    });
  } catch (err) {
    console.error("QR INITIATE:", err.message);
    res.status(500).json({ success: false, message: "Failed to initiate QR payment" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// QR PAYMENT: Confirm (webhook or manual confirm from admin/UPI callback)
// ─────────────────────────────────────────────────────────────────────────────
const confirmQrPayment = async (req, res) => {
  try {
    const { orderId, qrPaymentRef } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.qrPaymentRef !== qrPaymentRef) {
      return res.status(400).json({ success: false, message: "QR reference mismatch" });
    }

    order.paymentStatus = "paid";
    order.status        = "processing";
    await order.save();

    // Clear cart
    await Cart.findOneAndUpdate({ userId: order.user }, { items: [] });

    // Emit real-time update
    const io = req.app.get("io");
    io?.to(String(order.user)).emit("orderUpdated", order);

    res.json({ success: true, order });
  } catch (err) {
    console.error("QR CONFIRM:", err.message);
    res.status(500).json({ success: false, message: "Failed to confirm QR payment" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET MY ORDERS (logged-in user)
// ─────────────────────────────────────────────────────────────────────────────
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  initiateQrPayment,
  confirmQrPayment,
  getMyOrders,
};
