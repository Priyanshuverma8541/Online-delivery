// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const path = require("path");

// dotenv.config();

// const connectDB = require("./config/db");
// const connectCloudinary = require("./config/cloudinary");

// const app = express();
// const server = http.createServer(app);
// const PORT = process.env.PORT || 8080;

// // // ─── ALLOWED ORIGINS ────────────────────────────────────────────────────────
// // const ALLOWED_ORIGINS = [
// //   "http://localhost:5173",
// //   "http://localhost:5174",        // admin panel (Vite default alt port)
// //   process.env.CLIENT_URL,
// //   process.env.ADMIN_URL,
// // ].filter(Boolean);

// // // ─── CORS ───────────────────────────────────────────────────────────────────
// // app.use(
// //   cors({
// //     origin: (origin, cb) => {
// //       // Allow requests with no origin (mobile apps, curl, etc.)
// //       if (!origin) return cb(null, true);
// //       if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
// //       cb(new Error(`CORS: origin ${origin} not allowed`));
// //     },
// //     credentials: true,
// //     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
// //     allowedHeaders: ["Content-Type", "Authorization"],
// //   })
// // );
// // app.options("*", cors());
// const normalize = (url) => url?.trim().replace(/\/$/, "");

// const allowedOrigins = [
//   "http://localhost:5173",
//   "http://localhost:5174",
//   process.env.CLIENT_URL,
//   process.env.ADMIN_URL,
// ]
//   .filter(Boolean)
//   .map(normalize);

// app.use(cors({
//   origin: (origin, cb) => {
//     if (!origin) return cb(null, true);

//     const normalizedOrigin = normalize(origin);

//     if (allowedOrigins.includes(normalizedOrigin)) {
//       return cb(null, true);
//     }

//     console.log("❌ BLOCKED:", normalizedOrigin);
//     console.log("✅ ALLOWED:", allowedOrigins);

//     cb(new Error(`CORS: origin ${origin} not allowed`));
//   },
//   credentials: true
// }));

// // ─── BODY PARSERS ───────────────────────────────────────────────────────────
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use(express.static(path.join(__dirname, "public")));

// // ─── HEALTH CHECK ───────────────────────────────────────────────────────────
// app.get("/health", (req, res) => {
//   res.json({ status: "ok", timestamp: new Date().toISOString() });
// });

// // ─── API ROUTES ─────────────────────────────────────────────────────────────
// app.use("/api/users",    require("./routes/userRoutes"));
// app.use("/api/products", require("./routes/productRoutes"));
// app.use("/api/carts",    require("./routes/cartRoutes"));
// app.use("/api/orders",   require("./routes/orderRoutes"));
// app.use("/api/payment",  require("./routes/paymentRoutes"));

// // ─── 404 HANDLER ────────────────────────────────────────────────────────────
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: "Route not found" });
// });

// // ─── GLOBAL ERROR HANDLER ────────────────────────────────────────────────────
// // eslint-disable-next-line no-unused-vars
// app.use((err, req, res, next) => {
//   console.error("❌ Unhandled error:", err.message);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || "Internal server error",
//   });
// });

// // ─── SOCKET.IO ──────────────────────────────────────────────────────────────
// const io = new Server(server, {
//   cors: { origin: ALLOWED_ORIGINS, methods: ["GET", "POST"] },
// });

// io.on("connection", (socket) => {
//   console.log("🔌 Socket connected:", socket.id);

//   // Client calls this after login so we can route events to them
//   socket.on("joinUserRoom", (userId) => {
//     socket.join(String(userId));
//     console.log(`👤 Socket ${socket.id} joined room: ${userId}`);
//   });

//   socket.on("disconnect", () => {
//     console.log("🔌 Socket disconnected:", socket.id);
//   });
// });

// // Attach io to app so controllers can emit events
// app.set("io", io);

// // ─── START ───────────────────────────────────────────────────────────────────
// (async () => {
//   await connectDB();
//   await connectCloudinary();

//   server.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//   });
// })();

// // ─── GRACEFUL SHUTDOWN ───────────────────────────────────────────────────────
// const shutdown = async () => {
//   console.log("🛑 Shutting down...");
//   const mongoose = require("mongoose");
//   await mongoose.disconnect();
//   server.close(() => process.exit(0));
// };

// process.on("SIGINT",  shutdown);
// process.on("SIGTERM", shutdown);

// process.on("uncaughtException",  (err) => console.error("⚠️  Uncaught Exception:",  err));
// process.on("unhandledRejection", (err) => console.error("⚠️  Unhandled Rejection:", err));
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
  "http://localhost:5173",
  "http://localhost:5174",
  // Production (hardcoded so they always work even if env var is missing)
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


