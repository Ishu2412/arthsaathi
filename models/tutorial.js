import mongoose from "mongoose";

const tutorialSchema = mongoose.Schema({
  email: { type: String, required: true },
  beginner: [],
  intermediate: [],
  advanced: [],
});

const Tutorial = mongoose.model("Tutorial", tutorialSchema);

export default Tutorial;
