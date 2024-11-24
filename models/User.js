const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  completedTopics: [
    {
      topicId: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
      subtopicIds: [Number], // Track completed subtopics by their ID
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
