const express = require("express");
const http    = require("http");
const { Server } = require("socket.io");
const dotenv  = require("dotenv");
const cors    = require("cors");
const path    = require("path");
 
dotenv.config();
 
const connectDB        = require("./config/db");
const connectCloudinary = require("./config/cloudinary");
 
const app    = express();
const server = http.createServer(app);
const PORT   = process.env.PORT || 8080;
 
// ── ALLOWED ORIGINS ──────────────────────────────────────────────────────────
// Hardcoded production URLs as fallback + env vars for flexibility
const ALLOWED_ORIGINS = [
  "http://192.168.56.1:5173",
  "http://localhost:5173",
  "http://localhost:5174",
  // Production (hardcoded so they always work even if env var is missing)
  "https://online-delivery-wxjr.vercel.app/",
  "https://online-delivery-gilt.vercel.app",
  // From .env (extra flexibility for future domains)
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
]
  .filter(Boolean)
  .map((o) => o.trim().replace(/\/$/, "")); // strip trailing slashes
 
console.log("✅ CORS allowed origins:", ALLOWED_ORIGINS);
 
// ── CORS ─────────────────────────────────────────────────────────────────────
const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow no-origin (Postman, mobile)
    const clean = origin.trim().replace(/\/$/, "");
    if (ALLOWED_ORIGINS.includes(clean)) return cb(null, true);
    console.warn("🚫 CORS blocked:", origin);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};
 
// OPTIONS preflight MUST come before app.use(cors())
app.options("*", cors(corsOptions));
app.use(cors(corsOptions));
 
// ── BODY PARSERS ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));
 
// ── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    allowedOrigins: ALLOWED_ORIGINS,
  });
});
 
// ── API ROUTES ────────────────────────────────────────────────────────────────
app.use("/api/users",    require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/carts",    require("./routes/cartRoutes"));
app.use("/api/orders",   require("./routes/orderRoutes"));
app.use("/api/payment",  require("./routes/paymentRoutes"));
 
// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});
 
// ── GLOBAL ERROR HANDLER ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});
 
// ── SOCKET.IO ─────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
 
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);
 
  socket.on("joinUserRoom", (userId) => {
    socket.join(String(userId));
    console.log(`👤 Socket ${socket.id} joined room: ${userId}`);
  });
 
  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected:", socket.id);
  });
});
 
app.set("io", io);
 
// ── START ─────────────────────────────────────────────────────────────────────
(async () => {
  await connectDB();
  await connectCloudinary();
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})();
 
// ── GRACEFUL SHUTDOWN ─────────────────────────────────────────────────────────
const shutdown = async () => {
  console.log("🛑 Shutting down...");
  const mongoose = require("mongoose");
  await mongoose.disconnect();
  server.close(() => process.exit(0));
};
process.on("SIGINT",  shutdown);
process.on("SIGTERM", shutdown);
process.on("uncaughtException",  (err) => console.error("⚠️  Uncaught Exception:",  err));
process.on("unhandledRejection", (err) => console.error("⚠️  Unhandled Rejection:", err));


