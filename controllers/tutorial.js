import Tutorial from "../models/tutorial.js";

import { llmGenerator } from "../utils/llm.js";

export async function createTutorial(req, res) {
  try {
    const { email, beginer = [], intermediate = [], advanced = [] } = req.body;

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
    const { email, level } = req.body;

    const tutorial = await llmGenerator(
      `Provide the name of chapters of financial course in plain text without using spacial characters like \n, *, - for ${level} level. Do not add next line character.`
    );
    res.status(200).json(tutorial);
  } catch (error) {
    console.error(`Error generating tutorial: ${error}`);
    res.status(500).send("Internal server error");
  }
}
