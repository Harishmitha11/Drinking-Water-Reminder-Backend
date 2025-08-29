const mongoose = require("mongoose");

const WaterLogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amountMl: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WaterLog", WaterLogSchema);
