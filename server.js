// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const dotenv = require("dotenv");

// dotenv.config(); // load .env

// const waterRoute = require("./routes/water");
// const logRoute = require("./routes/log");

// const app = express();
// app.use(cors({
//   origin: "https://resilient-zabaione-8e4423.netlify.app", // replace with your actual Netlify URL
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));
// app.use(express.json());

// // Routes
// app.use("/api/water", waterRoute);
// app.use("/api/log", logRoute);

// // MongoDB connection with error logging
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.error("MongoDB connection error:", err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // load .env

const waterRoute = require("./routes/water");
const logRoute = require("./routes/log");

const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    "https://resilient-zabaione-8e4423.netlify.app",
    "http://localhost:3000", // for local development
    "http://localhost:3001"  // alternative local port
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With", 
    "Content-Type", 
    "Accept",
    "Authorization",
    "Cache-Control"
  ],
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Additional middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add a simple health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.get('Origin')}`);
  next();
});

// Routes
app.use("/api/water", waterRoute);
app.use("/api/log", logRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// MongoDB connection with better error handling
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
    process.exit(1); // Exit if database connection fails
  });

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for: ${corsOptions.origin.join(', ')}`);
});