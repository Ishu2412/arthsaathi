import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { sendEmail } from "../utils/mail.js";

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
      res.status(409).send(`User already exists. Try loggin in.`);
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);
    sendEmail(email, otp);
    res.status(200).json({ otp: otp });
  } catch (err) {
    console.error(`Error while sending OTP: ${err}`);
    res.status(500).send(`Internal server error`);
  }
};

export const signup = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const userName = req.body.userName;
    const data = {
      email,
      password,
      userName,
    };
    const check = await findUser(data);
    console.log(email);
    console.log(password);

    //if user already exists
    if (check) {
      console.log(check);
      res.status(409).send(`User already exists. Try loggin in.`);
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log(`Error while hashing the password ${err}`);
        } else {
          const user = {
            email: email,
            password: hash,
            userName: userName,
          };
          await registerUser(user);
          res.status(200).send("registered");
        }
      });
    }
  } catch (err) {
    console.error(`Error while registering the user: ${err}`);
    res.status(500).send(`Internal server error`);
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
