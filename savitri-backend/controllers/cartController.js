const mongoose = require("mongoose");
const Cart    = require("../models/Cart");

// ─── GET CART ─────────────────────────────────────────────────────────────────
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
    res.json({ success: true, items: cart?.items || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch cart" });
  }
};

// ─── ADD / UPDATE ITEM ────────────────────────────────────────────────────────
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID" });
    }

    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    const idx = cart.items.findIndex((i) => i.productId.toString() === productId);

    if (idx > -1) {
      cart.items[idx].quantity += Number(quantity);
    } else {
      cart.items.push({ productId, quantity: Number(quantity) });
    }

    await cart.save();
    await cart.populate("items.productId");

    res.json({ success: true, items: cart.items });
  } catch (err) {
    console.error("ADD TO CART:", err.message);
    res.status(500).json({ success: false, message: "Failed to update cart" });
  }
};

// ─── REMOVE ITEM ──────────────────────────────────────────────────────────────
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);

    await cart.save();
    await cart.populate("items.productId");

    res.json({ success: true, items: cart.items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to remove item" });
  }
};

// ─── CLEAR CART (called after successful payment) ─────────────────────────────
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });
    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to clear cart" });
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };
