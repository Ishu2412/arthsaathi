import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { sendEmail } from "../utils/mail.js";
import { OTPStore } from "../models/otp.js";

const saltRounds = 10;

const registerUser = async (data) => {
  const user = new User(data);
  await user.save();
};

const findUser = async (data) => {
  const user = await User.findOne({ email: data.email });
  return user;
};

export const sendOTP = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await findUser({ email: email });
    if (user) {
      return res.status(409).send("User already exists. Try logging in.");
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`Generated OTP: ${otp}`);

    const otpEntry = new OTPStore({
      email: email,
      otp: otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    await otpEntry.save();

    sendEmail(email, otp);
    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (err) {
    console.error(`Error while sending OTP: ${err}`);
    res.status(500).send("Internal server error");
  }
};

const verifyOTP = async (email, otp) => {
  try {
    const otpEntry = await OTPStore.findOne({ email: email });

    if (!otpEntry) {
      return "OTP not found. Please request a new one.";
    }

    if (otpEntry.expiresAt < Date.now()) {
      await OTPStore.deleteOne({ email: email });
      return "OTP has expired. Please request a new one.";
    }

    if (otpEntry.otp !== Number(otp)) {
      return "Invalid OTP. Please try again.";
    }

    await OTPStore.deleteOne({ email: email });

    return "success";
  } catch (err) {
    console.error(`Error while verifying OTP: ${err}`);
    return "Internal server error";
  }
};

export const signup = async (req, res) => {
  try {
    const otp = req.body.otp;
    const email = req.body.email;
    const password = req.body.password;

    const ans = await verifyOTP(email, otp);
    if (ans !== "success") {
      if (ans === "Internal server error") {
        return res.status(500).send("Internal server error");
      } else {
        return res.status(400).send(ans);
      }
    }

    const check = await findUser({ email });
    if (check) {
      return res.status(409).send("User already exists. Try logging in.");
    }

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error(`Error while hashing the password: ${err}`);
        return res.status(500).send("Error while hashing the password");
      }

      const user = {
        email: email,
        password: hash,
      };

      await registerUser(user);
      return res.status(200).send("Registered successfully");
    });
  } catch (err) {
    console.error(`Error while registering the user: ${err}`);
    return res.status(500).send("Internal server error");
  }
};

export const login = async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      password: req.body.password,
    };
    const user = await findUser(data);
    if (user) {
      const storedHashedPassword = user.password;
      bcrypt.compare(data.password, storedHashedPassword, (err, result) => {
        if (err) {
          res.status(500).send(`Error while Authorizing`);
        } else {
          if (result) {
            res.status(200).send("logined");
          } else {
            res.status(401).send(`Password not match`);
          }
        }
      });
    } else {
      res.status(404).send(`User not found`);
    }
  } catch {
    res.status(500).send(`Internal Server Error`);
  }
};
