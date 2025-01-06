import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import env from "dotenv";

env.config();
if (!process.env.API_KEY) {
  throw new Error(
    "API_KEY is missing. Please check your environment variables."
  );
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function llmGenerator(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      safetySettings: [],
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating caption:", error.message);
    throw error;
  }
}

async function generateMessage(msg, hist, config = {}) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

    const generationConfig = {
      temperature: config.temperature || 0.9,
      topK: config.topK || 1,
      topP: config.topP || 1,
      maxOutputTokens: config.maxOutputTokens || 1024,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: hist,
    });

    const result = await chat.sendMessage(msg);
    return result.response.text();
  } catch (error) {
    console.error("Error generating chat message:", error.message);
    throw error;
  }
}

export { llmGenerator, generateMessage };
