const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Mark or unmark a subtopic as completed
router.post("/mark", authMiddleware, async (req, res) => {
  const { topicId, subtopicId, isComplete } = req.body;
  const { userId } = req; // Extract userId from the request object set by the auth middleware

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Find the topic in the user's completedTopics array
    let topicProgress = user.completedTopics.find(
      (t) => t.topicId.toString() === topicId
    );

    // If no progress for this topic exists, initialize it
    if (!topicProgress) {
      if (!isComplete) {
        // If trying to unmark a non-existing topic, return early
        return res
          .status(400)
          .json({ error: "Cannot unmark a subtopic that was not completed" });
      }
      topicProgress = { topicId, subtopicIds: [] };
      user.completedTopics.push(topicProgress);
    }

    // Handle marking as complete or uncomplete
    if (isComplete) {
      // Add subtopic if not already completed
      if (!topicProgress.subtopicIds.includes(subtopicId)) {
        topicProgress.subtopicIds.push(subtopicId);
      }
    } else {
      // Remove subtopic from the completed list
      topicProgress.subtopicIds = topicProgress.subtopicIds.filter(
        (id) => id !== subtopicId
      );

      // If the topic has no completed subtopics, remove it entirely
      if (topicProgress.subtopicIds.length === 0) {
        user.completedTopics = user.completedTopics.filter(
          (t) => t.topicId.toString() !== topicId
        );
      }
    }

    await user.save();
    res.status(200).json({
      message: isComplete
        ? "Subtopic marked as completed"
        : "Subtopic marked as uncompleted",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Failed to update subtopic completion status" });
  }
});

module.exports = router;
