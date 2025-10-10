import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client with the API key from environment variables.
export const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
