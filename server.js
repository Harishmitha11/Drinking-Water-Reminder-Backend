const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const waterRoute = require("./routes/water");
const logRoute = require("./routes/log");

const app = express();

// ✅ Global CORS middleware (always first)
app.use(cors());
app.options("*", cors()); // handle preflight requests for all routes

// ✅ Extra manual headers (safety net)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({ message: "API running with CORS disabled" });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    cors: "GLOBAL - All origins allowed",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// CORS test endpoint
app.get("/cors-test", (req, res) => {
  res.json({
    message: "CORS test successful - Global CORS enabled",
    origin: req.get("Origin") || "No Origin",
    userAgent: req.get("User-Agent"),
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use("/api/water", waterRoute);
app.use("/api/log", logRoute);

// Extra POST test
app.post("/api/water", (req, res) => {
  res.json({ message: "Water log received" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ 
    error: "Internal Server Error",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ 
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 CORS: GLOBAL - All origins allowed`);
});
