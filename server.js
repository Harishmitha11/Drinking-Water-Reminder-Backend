const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // load .env

const waterRoute = require("./routes/water");
const logRoute = require("./routes/log");

const app = express();
app.use(cors({
  origin: "https://resilient-zabaione-8e4423.netlify.app", // replace with your actual Netlify URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/water", waterRoute);
app.use("/api/log", logRoute);

// MongoDB connection with error logging
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
