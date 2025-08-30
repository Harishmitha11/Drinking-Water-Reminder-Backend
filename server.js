const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const userInputRoutes = require("./routes/userInput");

const app = express();

// ✅ Fix: Configure CORS properly
app.use(
  cors({
    origin: "https://drinking-water-reminder-frontend.onrender.com", // your frontend link
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/water", userInputRoutes);

// MongoDB connection
mongoose
  .connect("your-mongodb-url", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB error: " + err.message));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
