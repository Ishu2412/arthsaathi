import Groq from "groq-sdk";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Groq with API key
const groq = new Groq(process.env.GROQ_API_KEY);

// Define schema for text summarization
const schema = {
  properties: {
    title: { title: "Title", type: "string" },
    summary: { title: "Summary", type: "string" },
  },
  required: ["title", "summary"],
  title: "Text Summary",
  type: "object",
};

class Summary {
  constructor(title, summary) {
    this.title = title;
    this.summary = summary;
  }
}

// Function to get a summary for a given text
export async function groqSummary(text, language) {
  const jsonSchema = JSON.stringify(schema, null, 4);

  try {
    const chat_completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert summarization assistant. Your task is to summarize the provided text and return the output in JSON format in ${language}. The JSON object must follow this schema: ${jsonSchema}`,
        },
        {
          role: "user",
          content: `Summarize the following text:\n\n${text}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      stream: false,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(chat_completion.choices[0].message.content);

    // Extract title and summary
    const { title, summary } = result;
    return summary;
  } catch (error) {
    console.error("Error getting summary:", error.message);
    throw error;
  }
}

// Tutorial Generation
const schema2 = {
  properties: {
    chapters: {
      title: "Chapters",
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["chapters"],
  title: "Finance Course Outline",
  type: "object",
};

class Course {
  constructor(chapters) {
    this.chapters = chapters;
  }
}

// Function to generate a course outline based on the user's level
export async function generateFinanceCourse(
  level,
  profession,
  financialGoals,
  language
) {
  const jsonSchema = JSON.stringify(schema2, null, 4);

  try {
    const chat_completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert course creator specializing in finance. Your task is to create a course outline tailored to the user's level (beginner, intermediate, or advanced) in ${language}. The course should include only the chapter names and follow this JSON schema: ${jsonSchema}`,
        },
        {
          role: "user",
          content: `Generate a course outline on finance for a ${level}-level user for ${profession} profession for ${financialGoals}. Provide only the chapter names.`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      stream: false,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(chat_completion.choices[0].message.content);

    // Extract chapters
    const { chapters } = result;
    console.log(chapters);
    return chapters;
  } catch (error) {
    console.error("Error generating course outline:", error.message);
    throw error;
  }
}

// Course content Generation
const schema3 = {
  properties: {
    content: {
      title: "Content",
      type: "string",
    },
  },
  required: ["content"],
  title: "Finance Course Outline",
  type: "object",
};

class CourseContent {
  constructor(content) {
    this.content = content;
  }
}

// Function to generate a course outline based on the user's level
export async function generateCourseContent(name, level, language) {
  const jsonSchema = JSON.stringify(schema3, null, 4);

  try {
    const chat_completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert course content creator specializing in finance. Your task is to create detailed and relevant course content for the topic provided. The content must be tailored to the user's level (beginner, intermediate, or advanced) and written in ${language}. You must strictly adhere to the following JSON schema: ${jsonSchema}Ensure the response: 1. Includes a clear and concise chapter title under the "chapter" field. 2. Provides structured, relevant, and in-depth content related to the specified topic under the "content" field. 3. Focuses only on the requested topic without adding unrelated details or explanations.`,
        },
        {
          role: "user",
          content: `Generate a course content of 400 words for the topic "${name}" at the ${level} level. Write the content in ${language} and ensure it provides valuable insights and details relevant to the topic.`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      stream: false,
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(chat_completion.choices[0].message.content);

    // Extract chapter
    console.log(result);
    const { content } = result;
    console.log(content);
    return content;
  } catch (error) {
    console.error("Error generating course outline:", error.message);
    throw error;
  }
}
