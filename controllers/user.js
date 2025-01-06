import { User } from "../models/user.js";

export const getUser = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(200).send(user);
    } else {
      return res.status(404).send("User not found");
    }
  } catch (err) {
    console.error(`Error while getting user: ${err}`);
    return res.status(500).send("Internal server error");
  }
};
