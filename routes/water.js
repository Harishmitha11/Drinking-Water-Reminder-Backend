const express = require("express");
const router = express.Router();
const UserInput = require("../models/UserInput");

router.post("/", async (req, res) => {
  const { name, height, weight } = req.body;
  try {
    const dailyWaterMl = weight * 35;
    const user = new UserInput({ name, height, weight, dailyWaterMl });
    await user.save();
    res.json({ name, dailyWaterMl, dailyWaterL: (dailyWaterMl/1000).toFixed(2) });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
