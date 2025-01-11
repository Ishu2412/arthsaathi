import Tutorial from "../models/tutorial.js";

import { generateFinanceCourse } from "../utils/llm.js";

export async function createTutorial(req, res) {
  try {
    const { email, beginer = [], intermediate = [], advanced = [] } = req.body;

    const check = await Tutorial.findOne({ email: email });

    if (check) {
      return res.status(200).send("Tutorial already exists");
    }

    const tutorial = new Tutorial({
      email,
      beginer,
      intermediate,
      advanced,
    });

    await tutorial.save();
    res.status(201).json(tutorial);
  } catch (error) {
    console.error(`Error creating tutorial: ${error}`);
    res.status(500).send("Internal server error");
  }
}

export async function generateTutorial(req, res) {
  try {
    const { email, level, profession, financialGoals } = req.body;

    const tutorial = await Tutorial.findOne({ email: email });
    const result = await generateFinanceCourse(
      level,
      profession,
      financialGoals
    );

    if (level === "beginner") {
      tutorial.beginer = result;
    } else if (level === "intermediate") {
      tutorial.intermediate = result;
    } else {
      tutorial.advanced = result;
    }

    await tutorial.save();

    res.status(200).json(tutorial);
  } catch (error) {
    console.error(`Error generating tutorial: ${error}`);
    res.status(500).send("Internal server error");
  }
}
