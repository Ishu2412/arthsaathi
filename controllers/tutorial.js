import Tutorial from "../models/tutorial.js";

import { generateFinanceCourse, generateCourseContent } from "../utils/llm.js";

export async function createTutorial(req, res) {
  try {
    const { email } = req.body;

    const check = await Tutorial.findOne({ email: email });

    if (check) {
      return res.status(200).json(check);
    }

    const tutorial = new Tutorial({
      email,
    });

    await tutorial.save();
    res.status(201).json(tutorial);
  } catch (error) {
    console.error(`Error creating tutorial: ${error}`);
    res.status(500).send(`Internal server error: ${error}`);
  }
}

export async function generateTutorial(req, res) {
  try {
    const { email, level, profession, financialGoals, language } = req.body;

    const tutorial = await Tutorial.findOne({ email: email });

    console.log(tutorial);

    if (tutorial && tutorial[level].length > 0) {
      return res.status(200).json(tutorial);
    }

    const result = await generateFinanceCourse(
      level,
      profession,
      financialGoals,
      language
    );

    const updatedTutorial = [];
    for (const t in result) {
      const body = {
        title: result[t],
        content: await generateCourseContent(result[t], level, language),
      };
      console.log(body);
      updatedTutorial.push(body);
    }

    if (level === "beginner") {
      tutorial.beginner = updatedTutorial;
    } else if (level === "intermediate") {
      tutorial.intermediate = updatedTutorial;
    } else {
      tutorial.advanced = updatedTutorial;
    }

    await tutorial.save();

    res.status(200).json(tutorial);
  } catch (error) {
    console.error(`Error generating tutorial: ${error}`);
    res.status(500).send(`Internal server error: ${error}`);
  }
}
