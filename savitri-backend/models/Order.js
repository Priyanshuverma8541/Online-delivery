const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    price:    { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items:       [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },

    // Payment tracking
    paymentMethod: {
      type: String,
      enum: ["razorpay", "qr", "cash", "other"],
      default: "razorpay",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    // Order fulfilment tracking
    status: {
      type: String,
      enum: ["ordered", "processing", "shipped", "delivered", "cancelled"],
      default: "ordered",
    },

    // Razorpay details (populated on payment)
    paymentInfo: {
      razorpay_order_id:   { type: String },
      razorpay_payment_id: { type: String },
      razorpay_signature:  { type: String },
    },

    // QR payment reference (populated when QR method is used)
    qrPaymentRef: { type: String, default: null },

    // Salesforce Order ID – populated after SF sync
    salesforceOrderId: { type: String, default: null },

    shippingAddress: {
      line1:   { type: String },
      city:    { type: String },
      state:   { type: String },
      pincode: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
