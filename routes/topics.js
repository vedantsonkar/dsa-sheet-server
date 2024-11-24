const express = require("express");
const Topic = require("../models/Topic");
const router = express.Router();

// Get all topics
router.get("/", async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch topics" });
  }
});

module.exports = router;
