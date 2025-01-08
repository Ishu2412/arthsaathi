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
      `Create a full financial course in plain text, formatted as complete sentences. Do not use special characters like newline (\n), asterisks (*), dashes (-), or any list-style formatting. Write everything in continuous paragraphs with proper spacing. Each chapter name should be like "Chapter X: [Title]" `
    );
    res.status(200).json(tutorial);
  } catch (error) {
    console.error(`Error generating tutorial: ${error}`);
    res.status(500).send("Internal server error");
  }
}
