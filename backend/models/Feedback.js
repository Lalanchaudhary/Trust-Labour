const mongoose = require("mongoose");
const FeedbackSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
  });
  
  const Feedback = mongoose.model("Feedback", FeedbackSchema);
  module.exports = Feedback;
  