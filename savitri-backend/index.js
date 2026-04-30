const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");
const connectCloudinary = require("./config/cloudinary");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

// ─── ALLOWED ORIGINS ────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",        // admin panel (Vite default alt port)
  process.env.CLIENT_URL,
  process.env.ADMIN_URL,
].filter(Boolean);

// ─── CORS ───────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors());

// ─── BODY PARSERS ───────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

// ─── HEALTH CHECK ───────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── API ROUTES ─────────────────────────────────────────────────────────────
app.use("/api/users",    require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/carts",    require("./routes/cartRoutes"));
app.use("/api/orders",   require("./routes/orderRoutes"));
app.use("/api/payment",  require("./routes/paymentRoutes"));

// ─── 404 HANDLER ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ─── SOCKET.IO ──────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: { origin: ALLOWED_ORIGINS, methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // Client calls this after login so we can route events to them
  socket.on("joinUserRoom", (userId) => {
    socket.join(String(userId));
    console.log(`👤 Socket ${socket.id} joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("🔌 Socket disconnected:", socket.id);
  });
});

// Attach io to app so controllers can emit events
app.set("io", io);

// ─── START ───────────────────────────────────────────────────────────────────
(async () => {
  await connectDB();
  await connectCloudinary();

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();

// ─── GRACEFUL SHUTDOWN ───────────────────────────────────────────────────────
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
