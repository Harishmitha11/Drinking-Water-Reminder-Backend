const mongoose = require("mongoose");

const UserInputSchema = new mongoose.Schema({
  name: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  dailyWaterMl: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserInput", UserInputSchema);
