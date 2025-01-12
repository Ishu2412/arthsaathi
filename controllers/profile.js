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
    return res.status(500).send(`Internal server error: ${err}`);
  }
};

export const updateUser = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (user) {
      user.name = req.body.name;
      user.age = req.body.age;
      user.income = req.body.income;
      user.familySize = req.body.familySize;
      user.married = req.body.married;
      user.location = req.body.location;
      user.educationLevel = req.body.educationLevel;
      user.profession = req.body.profession;
      user.financialGoals = req.body.financialGoals;
      user.riskTolerance = req.body.riskTolerance;
      user.currentSavings = req.body.currentSavings;
      user.save();
      return res.status(200).send("User updated successfully");
    }
  } catch (err) {
    console.error(`Error while updating user: ${err}`);
    return res.status(500).send(`Internal server error: ${err}`);
  }
};
