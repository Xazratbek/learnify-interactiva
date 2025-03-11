import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// API Key
const GEMINI_API_KEY = "AIzaSyCdQfIkr8a9V14Bw-_iCViAZZk7O8Z3Vp8";

// Initialize the Google Generative AI client
export const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Default generation configuration
export const defaultGenerationConfig = {
  temperature: 0.7, // Controls creativity (0 = deterministic, 1 = creative)
  topK: 40, // Limits the model's choices to the top K options
  topP: 0.95, // Nucleus sampling (0.95 = diverse, 1.0 = deterministic)
  maxOutputTokens: 5000, // Increased token limit for longer responses
};

// Default safety settings
export const defaultSafetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Model name
export const GEMINI_MODEL = "gemini-1.5-flash"; // Updated to use the latest model
