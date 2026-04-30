const Order = require("../models/Order");

// ─── GET ORDERS FOR A USER ────────────────────────────────────────────────────
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// ─── GET SINGLE ORDER ─────────────────────────────────────────────────────────
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.productId");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
};

// ─── GET ALL ORDERS (Admin) ───────────────────────────────────────────────────
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullName email")
      .populate("items.productId")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// ─── UPDATE ORDER STATUS (Admin + Socket emit) ────────────────────────────────
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("items.productId");

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // Emit real-time update to the user's socket room
    const io = req.app.get("io");
    io?.to(String(order.user)).emit("orderUpdated", order);

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
};

module.exports = { getUserOrders, getOrder, getAllOrders, updateOrderStatus };
