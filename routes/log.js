const express = require("express");
const router = express.Router();
const WaterLog = require("../models/WaterLog");

// Log water intake
router.post("/", async (req, res) => {
  const { name, amountMl } = req.body;
  try {
    const log = new WaterLog({ name, amountMl });
    await log.save();
    res.json({ msg: "Logged successfully", log });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get last 7 days history
router.get("/:name", async (req, res) => {
  try {
    const logs = await WaterLog.find({ name: req.params.name })
      .sort({ date: -1 })
      .limit(7);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
