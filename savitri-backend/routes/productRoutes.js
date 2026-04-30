const express = require("express");
const router  = express.Router();
const multer  = require("multer");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// Multer – memory storage; actual upload happens inside createProduct
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Public
router.get("/",    getProducts);
router.get("/:id", getProduct);

// Admin only
router.post(  "/",    protect, adminOnly, upload.array("images", 10), createProduct);
router.put(   "/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
