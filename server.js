const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const waterRoute = require("./routes/water");
const logRoute = require("./routes/log");

const app = express();

// GLOBAL CORS - Allows ALL origins (domains)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");  // ✅ key fix
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // ✅ short-circuit preflight
  }
  next();
});
app.use(express.json());

// Add root route
app.get("/", (req, res) => {
  res.json({ message: "API running with CORS disabled" });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    cors: 'GLOBAL - All origins allowed',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// CORS test endpoint
app.get('/cors-test', (req, res) => {
  res.json({
    message: "CORS test successful - Global CORS enabled",
    origin: req.get('Origin') || 'No Origin',
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use("/api/water", waterRoute);
app.use("/api/log", logRoute);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: "Internal Server Error",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
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
  console.log("Database:", mongoose.connection.db.databaseName);
})
.catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 CORS: GLOBAL - All origins allowed`);
  console.log(`⚠️  WARNING: Global CORS enabled - suitable for development/testing`);
  console.log(`📅 Started: ${new Date().toISOString()}`);
});

app.post("/api/water", (req, res) => {
  res.json({ message: "Water log received" });
});