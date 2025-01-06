import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: Number, required: true },
  expiresAt: { type: Date, required: true },
});

const OTPStore = mongoose.model("OTPStore", otpSchema);

export { OTPStore };
