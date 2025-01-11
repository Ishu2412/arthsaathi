import Groq from "groq-sdk";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();
if (!process.env.GROQ_API_KEY) {
  throw new Error(
    "GROQ_API_KEY is missing. Please check your environment variables."
  );
}

// Initialize Groq AI with API key
const groq = new Groq(process.env.GROQ_API_KEY);

// Function to generate content (e.g., summarization) based on prompt input
async function groqGenerator(prompt) {
  try {
    // Define the schema for expected response
    const schema = {
      properties: {
        title: { title: "Title", type: "string" },
        summary: { title: "Summary", type: "string" },
      },
      required: ["title", "summary"],
      title: "Text Summary",
      type: "object",
    };

    // Serialize schema for use in system message
    const jsonSchema = JSON.stringify(schema, null, 4);

    // Use Groq's chat completions to generate content based on the prompt
    const chat_completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert summarization assistant. Your task is to summarize the provided text and return the output in JSON format. The JSON object must follow this schema: ${jsonSchema}`,
        },
        {
          role: "user",
          content: `Summarize the following text:\n\n${prompt}`,
        },
      ],
      model: "llama-3.3-70b-versatile", // Adjust to your model
      temperature: 0, // Adjust for creativity vs. accuracy
      stream: false, // Set to true for streaming
      response_format: { type: "json_object" },
    });

    // Parse the result and return as a structured summary
    const result = JSON.parse(chat_completion.choices[0].message.content);
    return result; // Returns the title and summary
  } catch (error) {
    console.error("Error generating summary:", error.message);
    throw error;
  }
}

// Function to print the summary
function printSummary(summary) {
  console.log("Title:", summary.title);
  console.log();
  console.log("Summary:");
  console.log(summary.summary);
}

// Main function
export async function llm(prompt, schema) {
  const summary = await groqGenerator(prompt, schema);
  printSummary(summary);
}
