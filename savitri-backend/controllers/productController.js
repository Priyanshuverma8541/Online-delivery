const Product    = require("../models/Product");
const cloudinary = require("cloudinary").v2;

// ─── Multer (memory storage → upload buffer to Cloudinary) ──────────────────
// multer upload is handled in productRoutes.js to avoid circular deps

// Helper: upload a single buffer to Cloudinary
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "savitri-jewellers" },
      (err, result) => (err ? reject(err) : resolve(result.secure_url))
    );
    stream.end(buffer);
  });

// ─── GET ALL ─────────────────────────────────────────────────────────────────
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (search)   filter.name     = { $regex: search, $options: "i" };

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
};

// ─── GET ONE ─────────────────────────────────────────────────────────────────
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch product" });
  }
};

// ─── CREATE (Admin) ──────────────────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const images = [];

    if (req.files?.length) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer);
        images.push(url);
      }
    }

    const product = await Product.create({ name, description, price, stock, category, images });
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("CREATE PRODUCT:", err.message);
    res.status(500).json({ success: false, message: "Failed to create product" });
  }
};

// ─── UPDATE (Admin) ──────────────────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update product" });
  }
};

// ─── DELETE (Admin) ──────────────────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete product" });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
