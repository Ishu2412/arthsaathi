import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: null,
  },
  age: {
    type: Number,
    default: null,
  },
  income: {
    type: Number,
    default: null,
  },
  familySize: {
    type: Number,
    default: null,
  },
  married: {
    type: Boolean,
    default: null,
  },
  location: {
    type: String,
    default: null,
  },
  educationLevel: {
    type: String,
    enum: ["Illiterate", "Primary", "Secondary", "Higher Education"],
    default: null,
  },
  profession: {
    type: String,
    default: null,
  },
  financialGoals: {
    type: [String], // Array of financial goals
    enum: ["Savings", "Investment", "Debt Management", "Business Growth"],
    default: [],
  },
  riskTolerance: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: null,
  },
  currentSavings: {
    type: Number,
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

export { User };
