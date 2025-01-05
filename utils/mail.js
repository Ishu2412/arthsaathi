import nodemailer from "nodemailer";
import env from "dotenv";

env.config();

export async function sendEmail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP for ArthSaathi registration",
    text: `Your OTP for ArthSaathi registration is ${otp}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    } else {
      console.log("Email sent:", info.response);
      res.status(200).json({
        status: "success",
        message: "Email sent successfully.",
      });
    }
  });
}
