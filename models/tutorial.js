import mongoose from "mongoose";

const tutorialSchema = mongoose.Schema({
  email: { type: String, required: true },
  beginer: [],
  intermediate: [],
  advanced: [],
});

const Tutorial = mongoose.model("Tutorial", tutorialSchema);

export default Tutorial;