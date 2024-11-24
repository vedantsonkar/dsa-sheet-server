const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtopics: [
    {
      id: Number,
      title: String,
      youtubeLink: String,
      leetcodeLink: String,
      articleLink: String,
      difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
    },
  ],
});

module.exports = mongoose.model("Topic", TopicSchema);
