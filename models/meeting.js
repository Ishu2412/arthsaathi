import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  participants: {
    type: [String],
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    default: "",
  },
  summary: {
    type: String,
    default: "",
  },
  notes: {
    type: String,
    default: "",
  },
});

const Meeting = mongoose.model("Meeting", meetingSchema);

export { Meeting };
